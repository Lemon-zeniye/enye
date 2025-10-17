import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { BlogService } from './blog.service';

import { UploadImagesInterceptor } from 'src/common/interceptors/upload.interceptor';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Post()
  @UploadImagesInterceptor('images', 1, './uploads/image-sections')
  async create(
    @Body() createBlogDto: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided!');
    }

    const mainImage = `/uploads/image-sections/${files[0].filename}`;

    const payload: CreateBlogDto & { image_url: string } = {
      ...createBlogDto,
      image_url: mainImage,
    };

    return this.blogService.create(payload);
  }

  @Patch(':id')
  @UploadImagesInterceptor('images', 1, './uploads/image-sections')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const payload: UpdateBlogDto & { image_url?: string } = {
      ...updateBlogDto,
    };

    if (files && files.length > 0) {
      payload.image_url = `/uploads/image-sections/${files[0].filename}`;
    }

    return this.blogService.update(+id, payload);
  }

  @Public()
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
