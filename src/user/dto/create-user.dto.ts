import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserType } from '../enums/user-type.enum';
import { SignupMethod } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserType)
  @IsOptional()
  user_type?: UserType;

  @IsEnum(SignupMethod)
  @IsOptional()
  signup_method?: SignupMethod;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
