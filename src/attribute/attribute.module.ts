import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantAttribute } from './entities/variant-attribute.entity';
import { ProductAttribute } from './entities/product-attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';
import { AttributeController } from './attribute.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VariantAttribute,
      ProductAttribute,
      AttributeValue,
    ]),
  ],
  controllers: [AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}
