// dto/cart-item.dto.ts
import {
  IsUUID,
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsDate,
} from 'class-validator';

export class CartItemDto {
  @IsNumber()
  productId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  @IsInt()
  quantity: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsDate()
  createdAt: Date;
}
