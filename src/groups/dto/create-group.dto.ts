// src/groups/dto/create-group.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ArrayMinSize,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGroupDto {
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsNumber()
  sortOrder: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsNumber({}, { each: true })
  @Type(() => Number)
  productIds?: number[];
}
