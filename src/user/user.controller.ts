import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  // @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getAllUser(@Req() req) {
    return this.userService.getAllUser();
  }

  @Public()
  @Post('/register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
