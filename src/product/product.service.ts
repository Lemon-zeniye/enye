import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { Category } from '../category/entities/category.entity';
import {
  CreateProductVariantDto,
  VariantAttributeDto,
} from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { VariantAttribute } from 'src/attribute/entities/variant-attribute.entity';
import { AttributeValue } from 'src/attribute/entities/attribute-value.entity';
import { AddVariantImagesDto } from './dto/add-variant-images.dto';
import { Group } from 'src/groups/entities/group.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(VariantAttribute)
    private readonly variantAttributeRepository: Repository<VariantAttribute>,
    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  // Product methods
  async create(createProductDto: CreateProductDto): Promise<Product> {
    let category: Category | null = null;
    let groups: Group[] = [];

    if (createProductDto.category_id) {
      category = await this.categoryRepository.findOne({
        where: { id: createProductDto.category_id },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createProductDto.category_id} not found`,
        );
      }
    }

    if (createProductDto.groupIds?.length) {
      groups = await this.groupRepository.findBy({
        id: In(createProductDto.groupIds),
      });

      if (groups.length !== createProductDto.groupIds.length) {
        throw new NotFoundException(`One or more groups not found`);
      }
    }

    const product = this.productRepository.create({
      ...createProductDto,
      category,
      groups,
      material: createProductDto.material || [],
      care_instructions: createProductDto.care_instructions || [],
    });

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect(
        'product.product_images',
        'product_image',
        'product_image.is_primary = :isPrimary',
        { isPrimary: true },
      )
      .orderBy('product.created_at', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    let category: Category | null = product.category;

    if (updateProductDto.category_id !== undefined) {
      if (updateProductDto.category_id === null) {
        category = null;
      } else {
        category = await this.categoryRepository.findOne({
          where: { id: updateProductDto.category_id },
        });
        if (!category) {
          throw new NotFoundException(
            `Category with ID ${updateProductDto.category_id} not found`,
          );
        }
      }
    }

    const updatedProduct = this.productRepository.merge(product, {
      ...updateProductDto,
      category,
      material:
        updateProductDto.material !== undefined
          ? updateProductDto.material
          : product.material,
      care_instructions:
        updateProductDto.care_instructions !== undefined
          ? updateProductDto.care_instructions
          : product.care_instructions,
    });

    return await this.productRepository.save(updatedProduct);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async softDelete(id: number): Promise<Product> {
    const product = await this.findOne(id);
    product.is_active = false;
    return await this.productRepository.save(product);
  }

  async restore(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.is_active = true;
    return await this.productRepository.save(product);
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return await this.productRepository.find({
      where: { category: { id: categoryId }, is_active: true },
      relations: ['category'],
      order: { created_at: 'DESC' },
    });
  }

  async findByGender(gender: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { gender: gender as any, is_active: true },
      relations: ['category'],
      order: { created_at: 'DESC' },
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.name ILIKE :query', { query: `%${query}%` })
      .orWhere('product.description ILIKE :query', { query: `%${query}%` })
      .andWhere('product.is_active = :isActive', { isActive: true })
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.created_at', 'DESC')
      .getMany();
  }

  // Variant methods

  async findVariant(variantId: number): Promise<ProductVariant> {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
      relations: ['product'],
    });
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }
    return variant;
  }

  async createVariant(
    productId: number,
    createVariantDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    const product = await this.findOne(productId);

    // Create the variant
    const variant = this.variantRepository.create({
      ...createVariantDto,
      product,
      productId: product.id,
    });

    const savedVariant = await this.variantRepository.save(variant);

    // Handle attributes if provided
    if (createVariantDto.attributes && createVariantDto.attributes.length > 0) {
      await this.addVariantAttributes(
        savedVariant.id,
        createVariantDto.attributes,
      );
    }

    // Reload the variant with relations
    return this.variantRepository.findOne({
      where: { id: savedVariant.id },
      relations: ['variantAttributes', 'variantAttributes.value'],
    });
  }

  private async addVariantAttributes(
    variantId: number,
    attributes: VariantAttributeDto[],
  ): Promise<void> {
    const valueIds = attributes.map((attr) => attr.value_id);
    const attributeValues = await this.attributeValueRepository.find({
      where: { id: In(valueIds) },
    });

    const variantAttributes = attributeValues.map((value) =>
      this.variantAttributeRepository.create({
        variant_id: variantId,
        value_id: value.id,
      }),
    );

    await this.variantAttributeRepository.save(variantAttributes);
  }

  async addVariantImages(
    variantId: number,
    images: Array<{
      image_url: string;
      alt_text?: string;
      is_primary: boolean;
      display_order: number;
    }>,
  ): Promise<ProductImage[]> {
    const variant = await this.findVariant(variantId);

    const imageEntities = images.map((imageData) =>
      this.imageRepository.create({
        ...imageData,
        product: variant.product,
        product_variant: variant,
      }),
    );

    return this.imageRepository.save(imageEntities);
  }

  async getVariantImages(variantId: number): Promise<ProductImage[]> {
    await this.findVariant(variantId); // Validate variant exists
    return this.imageRepository.find({
      where: { product_variant: { id: variantId } },
      order: { display_order: 'ASC' },
    });
  }

  async deleteVariantImage(imageId: number): Promise<void> {
    const result = await this.imageRepository.delete(imageId);
    if (result.affected === 0) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }
  }

  // async createVariant(
  //   productId: number,
  //   createVariantDto: CreateProductVariantDto,
  // ): Promise<ProductVariant> {
  //   const product = await this.findOne(productId);

  //   const variant = this.variantRepository.create({
  //     ...createVariantDto,
  //     product,
  //   });

  //   return await this.variantRepository.save(variant);
  // }

  async findAllVariants(productId: number): Promise<ProductVariant[]> {
    await this.findOne(productId); // Verify product exists

    return await this.variantRepository.find({
      where: { product: { id: productId } },
      relations: [
        'variantAttributes',
        'variantAttributes.value',
        'variantAttributes.value.attribute',
      ],
    });
  }

  async findOneVariant(
    productId: number,
    variantId: number,
  ): Promise<ProductVariant> {
    await this.findOne(productId); // Verify product exists

    const variant = await this.variantRepository.findOne({
      where: { id: variantId, product: { id: productId } },
      relations: [
        'variantAttributes',
        'variantAttributes.value',
        'variantAttributes.value.attribute',
      ],
    });

    if (!variant) {
      throw new NotFoundException(
        `Variant with ID ${variantId} not found for product ${productId}`,
      );
    }

    return variant;
  }

  async updateVariant(
    productId: number,
    variantId: number,
    updateVariantDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    const variant = await this.findOneVariant(productId, variantId);

    const updatedVariant = this.variantRepository.merge(
      variant,
      updateVariantDto,
    );
    return await this.variantRepository.save(updatedVariant);
  }

  async removeVariant(productId: number, variantId: number): Promise<void> {
    const variant = await this.findOneVariant(productId, variantId);
    await this.variantRepository.remove(variant);
  }

  // product.service.ts
  async createImages(
    productId: number,
    images: Array<{
      image_url: string;
      alt_text?: string;
      is_primary: boolean;
      display_order: number;
      variant_id?: number;
    }>,
  ): Promise<ProductImage[]> {
    const product = await this.findOne(productId);

    const imageEntities = images.map((imageData) =>
      this.imageRepository.create({
        ...imageData,
        product,
        product_variant: imageData.variant_id
          ? ({ id: imageData.variant_id } as ProductVariant)
          : undefined,
      }),
    );

    return this.imageRepository.save(imageEntities);
  }

  async findAllImages(productId: number): Promise<ProductImage[]> {
    await this.findOne(productId); // Verify product exists

    return await this.imageRepository.find({
      where: { product: { id: productId } },
      relations: ['product_variant'],
      order: { display_order: 'ASC' },
    });
  }

  async removeImage(productId: number, imageId: number): Promise<void> {
    await this.findOne(productId); // Verify product exists

    const image = await this.imageRepository.findOne({
      where: { id: imageId, product: { id: productId } },
    });

    if (!image) {
      throw new NotFoundException(
        `Image with ID ${imageId} not found for product ${productId}`,
      );
    }

    await this.imageRepository.remove(image);
  }

  async setImageAsPrimary(
    productId: number,
    imageId: number,
  ): Promise<ProductImage> {
    await this.findOne(productId); // Verify product exists

    const image = await this.imageRepository.findOne({
      where: { id: imageId, product: { id: productId } },
    });

    if (!image) {
      throw new NotFoundException(
        `Image with ID ${imageId} not found for product ${productId}`,
      );
    }

    // Reset all primary flags for this product
    await this.imageRepository.update(
      { product: { id: productId } },
      { is_primary: false },
    );

    // Set this image as primary
    image.is_primary = true;
    return await this.imageRepository.save(image);
  }
}
