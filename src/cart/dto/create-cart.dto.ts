// dto/create-cart.dto.ts
import {
  IsUUID,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDto } from './create-cart-item.dto';

export class CreateCartDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items?: CartItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;
}
