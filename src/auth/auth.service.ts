import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { SignupMethod, User, UserStatus } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dto/signup.dto';
import { OtpService } from './services/otp.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async login(
    user: User,
  ): Promise<{ access_token: string; user: Record<string, any> }> {
    try {
      const payload = {
        name: user.fullName,
        sub: user.id,
        roles: [user.user_type],
      };

      const accessToken = await this.jwtService.sign(payload);

      const userData = instanceToPlain(user, {
        excludePrefixes: ['password'],
      });

      return {
        user: userData,
        access_token: accessToken,
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }

  async validateGoogleUser(profile: any) {
    const email = profile.emails?.[0]?.value as string;
    const fullName = profile.displayName as string;

    // 1️⃣ Find existing user
    let user = await this.userService.findUserByEmail(email);

    // 2️⃣ If not found, create new user
    if (!user) {
      user = await this.userService.createUser({
        fullName,
        email,
        signup_method: SignupMethod.GOOGLE,
      });
    }

    return user;
  }

  //new sign up with otp

  async signup(
    signupDto: SignupDto,
  ): Promise<{ message: string; remainingEmails: number }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // For form signup, password is required
    if (signupDto.signupMethod === 'form' && !signupDto.password) {
      throw new BadRequestException('Password is required for form signup');
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (signupDto.password) {
      const saltRounds = 12;
      hashedPassword = await bcrypt.hash(signupDto.password, saltRounds);
    }

    // Create user with inactive status until OTP verification
    const user = this.userRepository.create({
      ...signupDto,
      password: hashedPassword,
      status: UserStatus.INACTIVE, // User will be activated after OTP verification
    });

    const savedUser = await this.userRepository.save(user);

    // Generate and send OTP
    const otpCode = await this.otpService.createOtp(
      signupDto.email,
      savedUser.id,
    );
    const emailSent = await this.otpService.sendOtpEmail(
      signupDto.email,
      otpCode,
    );

    if (!emailSent) {
      // Delete the user if email sending fails
      await this.userRepository.delete(savedUser.id);
      throw new BadRequestException(
        'Failed to send verification email. Please try again.',
      );
    }

    const remainingEmails = this.otpService.getRemainingEmails();

    return {
      message: 'Verification code sent to your email',
      remainingEmails,
    };
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string; user: User; access_token: string }> {
    const isValid = await this.otpService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.code,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Activate the user
    const user = await this.userRepository.findOne({
      where: { email: verifyOtpDto.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.status = UserStatus.ACTIVE;
    const updatedUser = await this.userRepository.save(user);

    const payload = {
      name: user.fullName,
      sub: user.id,
      roles: [user.user_type],
    };

    const accessToken = await this.jwtService.sign(payload);

    return {
      message: 'Email verified successfully',
      user: updatedUser,
      access_token: accessToken,
    };
  }

  async resendOtp(
    email: string,
  ): Promise<{ message: string; remainingEmails: number }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('Email is already verified');
    }

    const otpCode = await this.otpService.createOtp(email, user.id);
    const emailSent = await this.otpService.sendOtpEmail(email, otpCode);

    if (!emailSent) {
      throw new BadRequestException(
        'Failed to send verification email. Please try again.',
      );
    }

    const remainingEmails = this.otpService.getRemainingEmails();

    return {
      message: 'Verification code resent to your email',
      remainingEmails,
    };
  }
}
