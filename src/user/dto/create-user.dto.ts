import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from '../enums/user-type.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  role: UserType;

  @IsInt()
  @IsNotEmpty()
  phone_number: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}
