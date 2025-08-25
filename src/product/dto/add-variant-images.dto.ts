// add-variant-images.dto.ts
import {
  IsArray,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class VariantImageDto {
  @IsString()
  image_url: string;

  @IsString()
  @IsOptional()
  alt_text?: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;

  @IsNumber()
  @IsOptional()
  display_order?: number;
}

export class AddVariantImagesDto {
  @IsArray()
  images: VariantImageDto[];
}
