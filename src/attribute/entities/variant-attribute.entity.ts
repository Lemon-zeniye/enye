import { ProductVariant } from 'src/product/entities/product-variant.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AttributeValue } from './attribute-value.entity';

@Entity('variant_attributes')
export class VariantAttribute {
  @PrimaryColumn()
  variant_id: number;

  @PrimaryColumn()
  value_id: number;

  @ManyToOne(() => ProductVariant, (variant) => variant.variantAttributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => AttributeValue, (value) => value.variantAttributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'value_id' })
  value: AttributeValue;
}
