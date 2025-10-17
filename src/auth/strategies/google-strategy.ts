import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  // ✅ Force Google to always show account selection
  authorizationParams(): Record<string, string> {
    return {
      prompt: 'select_account',
      access_type: 'offline',
      include_granted_scopes: 'true',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const user = await this.authService.validateGoogleUser(profile);
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
