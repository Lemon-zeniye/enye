import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createCartDto: CreateCartDto) {
    const { userId } = createCartDto;
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} Not Found!`);
    }

    const cart = await this.cartRepository.create(createCartDto);
    return;
  }

  async findOne(id: number) {
    return await this.cartRepository.findOne({ where: { id } });
  }

  async findUserCarts(userId: number) {
    return await this.cartRepository.find({ where: { userId } });
  }

  async remove(id: number) {
    const cart = await this.cartRepository.findOne({ where: { id } });
    return await this.cartRepository.remove(cart);
  }
}
