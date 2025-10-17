// src/auth/dto/signup.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { SignupMethod } from 'src/user/entities/user.entity';

export class SignupDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsEnum(SignupMethod)
  signupMethod: SignupMethod;

  @IsString()
  @IsOptional()
  @MinLength(10)
  phone_number?: string;
}
