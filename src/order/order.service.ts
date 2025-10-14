import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const { product_id, quantity, user_id } = createOrderDto;

    const product = await this.productRepository.findOne({
      where: { id: product_id },
    });

    const user = await this.userRepository.findOne({ where: { id: user_id } });

    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found`);
    }

    if (!product) {
      throw new NotFoundException(`Product with id ${product_id} not found`);
    }

    const payload = {
      user,
      total: quantity * product.base_price,
      items: [
        {
          product,
          quantity, // ✅ fixed spelling
          price: product.base_price,
        },
      ],
    };

    const order = this.orderRepository.create(payload);

    return await this.orderRepository.save(order);
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findUserOrders(user_id: number) {
    return await this.orderRepository.find({
      where: { user: { id: user_id } },
      relations: ['items', 'item.product'],
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    return await this.orderRepository.remove(order);
  }
}
