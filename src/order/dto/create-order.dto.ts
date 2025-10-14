import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
