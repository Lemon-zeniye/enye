import { PartialType } from '@nestjs/mapped-types';
import { CreateAttributeValueDto } from './attribute-value.dto';

export class UpdateAttributeValueDto extends PartialType(
  CreateAttributeValueDto,
) {}
