import { PartialType } from '@nestjs/mapped-types';
import { CreateProductAttributeDto } from './product-attribute.dto';

export class UpdateProductAttributeDto extends PartialType(
  CreateProductAttributeDto,
) {}
