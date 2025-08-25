import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsHexColor } from 'class-validator';

export class CreateAttributeValueDto {
  @IsNotEmpty()
  attributeId: number;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  display_name: string;

  @IsOptional()
  @IsHexColor()
  color_hex?: string;
}
