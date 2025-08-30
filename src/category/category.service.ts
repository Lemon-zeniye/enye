import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository, TreeRepository, DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
    private readonly dataSource: DataSource, // Inject DataSource
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { parent_category_id, ...rest } = createCategoryDto;

    let parentCategory: Category | null = null;

    if (parent_category_id) {
      parentCategory = await this.categoryRepository.findOne({
        where: { id: parent_category_id },
        relations: ['parent_category'],
      });

      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with id ${parent_category_id} not found`,
        );
      }

      // Count depth
      let depth = 1;
      let current = parentCategory;
      while (current.parent_category) {
        depth++;
        current = current.parent_category;
      }

      if (depth >= 3) {
        throw new Error('Cannot create category deeper than 3 levels');
      }
    }

    const newCategory = this.categoryRepository.create({
      ...rest,
      parent_category: parentCategory,
    });

    return this.categoryRepository.save(newCategory);
  }

  async findAll() {
    return await this.categoryRepository.findTrees();
  }

  async getNestedCategories(): Promise<Category[]> {
    const treeRepo: TreeRepository<Category> =
      this.categoryRepository.manager.getTreeRepository(Category);
    const categories = await treeRepo.findTrees();
    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent_category', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const { parent_category_id, ...rest } = updateCategoryDto;

    let parentCategory: Category | null = null;

    if (parent_category_id) {
      parentCategory = await this.categoryRepository.findOneBy({
        id: parent_category_id,
      });

      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with ID ${parent_category_id} not found`,
        );
      }

      if (parent_category_id === id) {
        throw new BadRequestException(`A category cannot be its own parent.`);
      }
    }

    if (updateCategoryDto.image_url && category.image_url) {
      // Delete the old image file
      const oldImagePath = path.join(process.cwd(), category.image_url);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedCategory = this.categoryRepository.merge(category, {
      ...rest,
      parent_category: parentCategory,
    });

    return await this.categoryRepository.save(updatedCategory);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.categoryRepository.remove(category);
  }

  // Optional: Method to rebuild tree structure (useful for testing)
  async rebuildTree() {
    // This will ensure closure table is properly built
    const allCategories = await this.categoryRepository.find({
      relations: ['parent_category'],
    });

    for (const category of allCategories) {
      await this.categoryRepository.save(category);
    }

    return { message: 'Tree structure rebuilt successfully' };
  }
}
