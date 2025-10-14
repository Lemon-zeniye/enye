import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { HeroService } from './hero.service';
import { UploadImagesInterceptor } from 'src/common/interceptors/upload.interceptor';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post()
  @UploadImagesInterceptor('images', 5, './uploads/heros')
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createHeroDto: any,
  ) {
    if (!files || files?.length === 0) {
      throw new BadRequestException('No image provided!');
    }

    const images = files.map((file) => `/uploads/heros/${file.filename}`);

    const payload = { ...createHeroDto, imageUrls: images };

    return this.heroService.create(payload);
  }

  @Get()
  findAll() {
    return this.heroService.findAll();
  }

  @Public()
  @Get('image-sections')
  async findImageSections() {
    return await this.heroService.findAllImageSection();
  }

  @Public()
  @Get('active-hero')
  async findActiveHero() {
    return await this.heroService.findActiveHero();
  }

  @Get('image-sections:id')
  async findOneImageSection(@Param('id') id: string) {
    return await this.heroService.findOneImageSection(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.heroService.findOne(+id);
  }

  @Patch(':id')
  @UploadImagesInterceptor('images', 5, './uploads/heros')
  update(
    @Param('id') id: string,
    @Body() updateHeroDto: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const images = files?.map((file) => `/uploads/heros/${file.filename}`);

    let payload: any = { ...updateHeroDto };

    if (images && images?.length > 0) {
      payload.imageUrls = images;
    }

    return this.heroService.update(+id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.heroService.remove(+id);
  }

  //image-sections

  @Post('image-sections')
  @UploadImagesInterceptor('images', 2, './uploads/image-sections')
  async createImageSections(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createImageSectionDto: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided!');
    }

    if (files.length < 2) {
      throw new BadRequestException(
        'Please provide both main and secondary images!',
      );
    }

    const mainImage = `/uploads/image-sections/${files[0].filename}`;
    const secondaryImage = `/uploads/image-sections/${files[1].filename}`;

    const payload = {
      ...createImageSectionDto,
      mainImage,
      secondaryImage,
    };

    return await this.heroService.createImageSection(payload);
  }

  @Patch('image-sections/:id')
  @UploadImagesInterceptor('images', 2, './uploads/image-sections')
  @UsePipes(ValidationPipe)
  async updateImageSections(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateImageSectionDto: any,
  ) {
    let payload = { ...updateImageSectionDto };

    if (files && files.length > 0) {
      if (files.length >= 1) {
        payload.mainImage = `/uploads/image-sections/${files[0].filename}`;
      }
      if (files.length >= 2) {
        payload.secondaryImage = `/uploads/image-sections/${files[1].filename}`;
      }
    }

    return await this.heroService.updateImageSection(+id, payload);
  }

  @Delete('image-sections/:id')
  async removeImageSections(@Param('id') id: string) {
    return await this.heroService.removeImageSection(+id);
  }

  @Get('active/all')
  async findActive() {
    return await this.heroService.findActiveImageSections();
  }
}
