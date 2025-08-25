import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
export class ProductImageDto {
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt_text?: string;

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;

  @IsOptional()
  @IsNumber()
  display_order?: number;

  @IsOptional()
  @IsNumber()
  variant_id?: number;
}
