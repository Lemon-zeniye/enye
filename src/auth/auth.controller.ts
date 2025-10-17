import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { Public } from './decorator/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @Public()
  login(@Req() req: Request) {
    return this.authService.login(req?.user as User);
  }
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    const payload = {
      name: user.fullName,
      sub: user.id,
      roles: [user.user_type],
    };
    const token = this.jwtService.sign(payload);

    // Redirect to frontend with token
    return res.redirect(
      `http://localhost:3001/callback?token=${token}&user_id=${user.id}`,
    );
  }
  @Public()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Public()
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body('email') email: string) {
    return this.authService.resendOtp(email);
  }
}
