import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { SignupMethod, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
}
