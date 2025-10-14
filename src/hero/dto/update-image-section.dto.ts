import { PartialType } from '@nestjs/swagger';
import { CreateImageSectionDto } from './create-image-section.dto';

export class UpdateImageSectionDto extends PartialType(CreateImageSectionDto) {}
