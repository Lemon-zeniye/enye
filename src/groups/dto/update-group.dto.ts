// src/groups/dto/update-group.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import {
  IsOptional,
  IsArray,
  ArrayMinSize,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @ValidateIf((o) => o.productIds !== undefined)
  productIds?: number[];
}
