import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    return this.userService.validateUser(email, password);
  }

  async login(user: User) {
    const validatedUser = await this.userService.validateUser(
      user.email,
      user.password,
    );

    const payload = {
      sub: validatedUser.id,
      user_name: validatedUser.firstName + ' ' + validatedUser.lastName,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      ...validatedUser,
      access_token,
    };
  }
}
