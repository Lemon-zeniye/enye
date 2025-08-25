// create-variant.dto.ts
import {
  IsNumber,
  IsOptional,
  IsString,
  IsDecimal,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VariantAttributeDto {
  @IsNumber()
  value_id: number;
}

export class CreateProductVariantDto {
  @IsString()
  sku: string;

  @IsNumber()
  @IsOptional()
  price_adjustment?: number;

  @IsNumber()
  @IsOptional()
  old_price_adjustment?: number;

  @IsNumber()
  stock_quantity: number;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantAttributeDto)
  @IsOptional()
  attributes?: VariantAttributeDto[];
}
