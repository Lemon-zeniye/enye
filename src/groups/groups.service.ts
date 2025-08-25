// src/groups/groups.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupsRepository.create(createGroupDto);

    if (createGroupDto.productIds && createGroupDto.productIds.length > 0) {
      group.products = await this.productsRepository.findBy({
        id: In(createGroupDto.productIds),
      });
    }

    return this.groupsRepository.save(group);
  }

  async findAll(): Promise<Group[]> {
    return this.groupsRepository.find({
      relations: ['products'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Group> {
    const group = await this.groupsRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id);

    // Update products if productIds are provided
    if (updateGroupDto.productIds !== undefined) {
      if (updateGroupDto.productIds.length === 0) {
        // Clear all products if empty array is provided
        group.products = [];
      } else {
        // Replace with new products
        group.products = await this.productsRepository.findBy({
          id: In(updateGroupDto.productIds),
        });
      }
    }

    // Update other properties
    const { productIds, ...updateData } = updateGroupDto;
    Object.assign(group, updateData);

    return this.groupsRepository.save(group);
  }

  async remove(id: number): Promise<void> {
    const result = await this.groupsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
  }

  async addProductsToGroup(
    groupId: number,
    productIds: number[],
  ): Promise<Group> {
    const group = await this.findOne(groupId);
    const products = await this.productsRepository.findBy({
      id: In(productIds),
    });

    // Add new products without removing existing ones
    const existingProductIds = group.products.map((p) => p.id);
    const newProducts = products.filter(
      (p) => !existingProductIds.includes(p.id),
    );

    group.products = [...group.products, ...newProducts];
    return this.groupsRepository.save(group);
  }

  async removeProductsFromGroup(
    groupId: number,
    productIds: number[],
  ): Promise<Group> {
    const group = await this.findOne(groupId);
    group.products = group.products.filter(
      (product) => !productIds.includes(product.id),
    );

    return this.groupsRepository.save(group);
  }

  async getProductsByGroupId(groupId: number): Promise<Product[]> {
    const group = await this.findOne(groupId);
    return group.products;
  }

  // 1. Get paginated groups with fixed limit of products per group
  async findGroupsWithProductsPaginated(
    page: number = 1,
    limit: number = 10,
    productsPerGroup: number = 10,
  ): Promise<{ groups: Group[]; total: number }> {
    console.log('333333333333');
    // First get paginated groups
    const [groups, total] = await this.groupsRepository
      .createQueryBuilder('group')
      .where('group.isActive = :isActive', { isActive: true })
      .orderBy('group.sortOrder', 'ASC')
      .addOrderBy('group.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    if (groups.length === 0) {
      return { groups: [], total: 0 };
    }

    // Get product IDs for each group using subquery
    const groupIds = groups.map((group) => group.id);

    // Get limited products for each group
    const groupsWithProducts = await Promise.all(
      groups.map(async (group) => {
        const products = await this.groupsRepository.manager
          .getRepository(Product)
          .createQueryBuilder('product')
          .innerJoin('product.groups', 'group', 'group.id = :groupId', {
            groupId: group.id,
          })
          .leftJoinAndSelect('product.category', 'category')
          .leftJoinAndSelect('product.product_images', 'product_images')
          .where('product.is_active = :isActive', { isActive: true })
          .orderBy('product.created_at', 'DESC')
          .take(productsPerGroup)
          .getMany();

        return {
          ...group,
          products,
        };
      }),
    );

    return { groups: groupsWithProducts, total };
  }

  // 2. Get specific group with paginated products
  async findGroupWithProductsPaginated(
    groupId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ group: Group; products: Product[]; total: number }> {
    // Get the group
    const group = await this.groupsRepository.findOne({
      where: { id: groupId, isActive: true },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Get total product count for the group
    const total = await this.groupsRepository
      .createQueryBuilder('group')
      .innerJoin('group.products', 'product')
      .where('group.id = :groupId', { groupId })
      .andWhere('group.isActive = :isActive', { isActive: true })
      .andWhere('product.is_active = :productActive', { productActive: true })
      .getCount();

    // Get paginated products for the group
    const products = await this.groupsRepository.manager
      .getRepository(Product)
      .createQueryBuilder('product')
      .innerJoin('product.groups', 'group', 'group.id = :groupId', { groupId })
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.product_images', 'product_images')
      .leftJoinAndSelect('product.product_variants', 'product_variants')
      .where('product.is_active = :isActive', { isActive: true })
      .orderBy('product.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { group, products, total };
  }
}
