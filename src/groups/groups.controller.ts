// src/groups/groups.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddProductsDto } from './dto/add-products.dto';
import { Group } from './entities/group.entity';
import { Product } from 'src/product/entities/product.entity';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('groups')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Public()
  @Get('list')
  async getGroupsWithProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('products') productsPerGroup?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const productsNum = productsPerGroup ? parseInt(productsPerGroup, 10) : 10;

    const result = await this.groupsService.findGroupsWithProductsPaginated(
      pageNum,
      limitNum,
      productsNum,
    );

    return {
      groups: result.groups,
      total: result.total,
      page: pageNum,
      limit: limitNum,
      productsPerGroup: productsNum,
      totalPages: Math.ceil(result.total / limitNum),
    };
  }

  @Public()
  @Get(':id/products-list')
  async getGroupProducts(
    @Param('id', ParseIntPipe) groupId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<{
    group: Group;
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.groupsService.findGroupWithProductsPaginated(
      groupId,
      page,
      limit,
    );

    const totalPages = Math.ceil(result.total / limit);

    return {
      group: result.group,
      products: result.products,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.remove(id);
  }

  @Get(':id/products')
  getProducts(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.getProductsByGroupId(id);
  }

  @Post(':id/products')
  addProducts(
    @Param('id', ParseIntPipe) id: number,
    @Body() addProductsDto: AddProductsDto,
  ) {
    return this.groupsService.addProductsToGroup(id, addProductsDto.productIds);
  }

  @Delete(':id/products')
  removeProducts(
    @Param('id', ParseIntPipe) id: number,
    @Body() removeProductsDto: AddProductsDto,
  ) {
    return this.groupsService.removeProductsFromGroup(
      id,
      removeProductsDto.productIds,
    );
  }

  @Post(':id/isActive')
  toggleIsActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() isActive: boolean,
  ) {
    return this.groupsService.toggleIsActive(id, isActive);
  }
}
