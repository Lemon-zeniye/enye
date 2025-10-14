// src/dto/create-image-section.dto.ts
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsUrl,
  IsNumber,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ImageSectionOrientation } from '../entities/ImageSection.entity';

export class CreateImageSectionDto {
  @IsEnum(ImageSectionOrientation)
  @IsNotEmpty()
  orientation: ImageSectionOrientation;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  mainImage: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  secondaryImage: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  buttonLabel: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  buttonLink?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
