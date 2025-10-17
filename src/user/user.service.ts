import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async getAllUser() {
    return await this.userRepository.find({ relations: ['orders'] });
  }

  async getUser(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(createUserDto: CreateUserDto) {
    let hashedPassword: string | undefined;

    if (createUserDto.password) {
      hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    }

    const user = {
      ...createUserDto,
      password: hashedPassword,
    };

    const savedUser = await this.userRepository.save(user);
    return instanceToPlain(savedUser);
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return instanceToPlain(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !password) {
      throw new HttpException('Invalid  Crediential', 401);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    return instanceToPlain(user) as User;
  }

  async editUserName(id: number, username: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    this.userRepository.merge(user, { fullName: username });
    return await this.userRepository.save(user);
  }

  //adress
  async createUserAddress(createAddressDto: CreateAddressDto) {
    const user = await this.userRepository.findOne({
      where: { id: createAddressDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    const { userId, ...rest } = createAddressDto;

    const newAddress = this.addressRepository.create({
      ...rest,
      user,
    });

    return await this.addressRepository.save(newAddress);
  }

  // Delete an address by ID
  async deleteUserAddress(id: number) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException('Address not found!');
    }
    await this.addressRepository.remove(address);
    return { message: 'Address deleted successfully' };
  }

  // Get all addresses
  async getUserAddresses(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return await this.addressRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async updateUserAddress(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException('Address not found!');
    }

    const updatedAddress = this.addressRepository.merge(
      address,
      updateAddressDto,
    );
    return await this.addressRepository.save(updatedAddress);
  }
}
