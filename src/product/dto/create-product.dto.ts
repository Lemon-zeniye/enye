import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  IsPositive,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Gender } from '../enums/gender-type.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  base_price: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  old_price?: number;

  @IsOptional()
  @IsNumber()
  category_id?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsNumber({}, { each: true })
  groupIds?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  material?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  care_instructions?: string[];
}
