import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';
import { UpdateAddressDto } from './dto/update-address.dto';

interface UserNamePayload {
  username: string;
}

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getAllUser() {
    return this.userService.getAllUser();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(+id);
  }

  @Public()
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('address/:id')
  getAllUserAddress(@Param('id') id: string): Promise<Address[]> {
    return this.userService.getUserAddresses(+id);
  }

  @Patch('user-name/:id')
  editUserName(@Param('id') id: string, @Body() payload: UserNamePayload) {
    return this.userService.editUserName(+id, payload.username);
  }

  // Create a new address
  @Post('address')
  createUserAddress(
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    return this.userService.createUserAddress(createAddressDto);
  }

  @Patch('address/:id')
  updateUserAddress(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.userService.updateUserAddress(+id, updateAddressDto);
  }

  // Delete an address by ID
  @Delete('address/:id')
  deleteUserAddress(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.deleteUserAddress(+id);
  }
}
