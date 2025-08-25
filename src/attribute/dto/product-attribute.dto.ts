import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AttributeValueEnum } from '../enums/attribute-value.enum'; // adjust path as needed

export class CreateProductAttributeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AttributeValueEnum)
  type: AttributeValueEnum;
}
