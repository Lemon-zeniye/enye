import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUser() {
    return await this.userRepository.find({ relations: ['orders'] });
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
}
