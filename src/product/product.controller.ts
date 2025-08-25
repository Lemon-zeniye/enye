import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { AddVariantImagesDto } from './dto/add-variant-images.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Product endpoints
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string): Promise<Product[]> {
    return this.productService.searchProducts(query);
  }

  @Get('category/:categoryId')
  findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Product[]> {
    return this.productService.findByCategory(categoryId);
  }

  @Get('gender/:gender')
  findByGender(@Param('gender') gender: string): Promise<Product[]> {
    return this.productService.findByGender(gender);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productService.remove(id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.softDelete(id);
  }

  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.restore(id);
  }

  // Variant endpoints
  @Post(':id/variants')
  @HttpCode(HttpStatus.CREATED)
  createVariant(
    @Param('id', ParseIntPipe) productId: number,
    @Body() createVariantDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    return this.productService.createVariant(productId, createVariantDto);
  }

  // product.controller.ts
  @Post('variants/:variantId/images')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `variant-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async addVariantImages(
    @Param('variantId', ParseIntPipe) variantId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any, // Capture form data
  ): Promise<ProductImage[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    const images = files.map((file, index) => ({
      image_url: `/uploads/products/${file.filename}`,
      alt_text: body[`alt_text_${index}`] || file.originalname,
      is_primary: body[`is_primary_${index}`] === 'true',
      display_order: parseInt(body[`display_order_${index}`]) || index,
    }));

    return this.productService.addVariantImages(variantId, images);
  }

  @Get('variants/:variantId/images')
  getVariantImages(
    @Param('variantId', ParseIntPipe) variantId: number,
  ): Promise<ProductImage[]> {
    return this.productService.getVariantImages(variantId);
  }

  @Delete('images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVariantImage(
    @Param('imageId', ParseIntPipe) imageId: number,
  ): Promise<void> {
    await this.productService.deleteVariantImage(imageId);
  }

  @Get(':id/variants')
  findAllVariants(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<ProductVariant[]> {
    return this.productService.findAllVariants(productId);
  }

  @Get(':id/variants/:variantId')
  findOneVariant(
    @Param('id', ParseIntPipe) productId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
  ): Promise<ProductVariant> {
    return this.productService.findOneVariant(productId, variantId);
  }

  @Patch(':id/variants/:variantId')
  updateVariant(
    @Param('id', ParseIntPipe) productId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() updateVariantDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    return this.productService.updateVariant(
      productId,
      variantId,
      updateVariantDto,
    );
  }

  @Delete(':id/variants/:variantId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVariant(
    @Param('id', ParseIntPipe) productId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
  ): Promise<void> {
    await this.productService.removeVariant(productId, variantId);
  }

  // Image endpoints
  @Post(':id/images')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `product-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadImages(
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any, // Change to capture all form data
  ): Promise<ProductImage[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    const images = files.map((file, index) => {
      const altText = body[`alt_text_${index}`] || file.originalname;
      const isPrimary = body[`is_primary_${index}`] === 'true';
      const displayOrder = parseInt(body[`display_order_${index}`]) || index;
      const variantId = body.variant_id ? parseInt(body.variant_id) : undefined;

      return {
        image_url: `/uploads/products/${file.filename}`,
        alt_text: altText,
        is_primary: isPrimary,
        display_order: displayOrder,
        variant_id: variantId,
      };
    });

    return this.productService.createImages(productId, images);
  }

  @Get(':id/images')
  findAllImages(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<ProductImage[]> {
    return this.productService.findAllImages(productId);
  }

  @Delete(':id/images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeImage(
    @Param('id', ParseIntPipe) productId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ): Promise<void> {
    await this.productService.removeImage(productId, imageId);
  }

  @Post(':id/images/:imageId/set-primary')
  setImageAsPrimary(
    @Param('id', ParseIntPipe) productId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ): Promise<ProductImage> {
    return this.productService.setImageAsPrimary(productId, imageId);
  }
}
