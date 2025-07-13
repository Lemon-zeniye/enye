import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { VariantAttribute } from './variant-attribute.entity';

@Entity()
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductAttribute, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  attribute: ProductAttribute;

  @Column()
  value: string;

  @Column()
  display_name: string;

  @Column({ nullable: true })
  color_hex?: string;

  @OneToMany(() => VariantAttribute, (va) => va.value)
  variantAttributes: VariantAttribute[];
}
