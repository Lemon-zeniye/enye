import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
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
        name: `${user.firstName} ${user.lastName}`,
        sub: user.id,
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
}
