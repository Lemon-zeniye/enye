import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { VariantAttribute } from 'src/attribute/entities/variant-attribute.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.product_variants, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'varchar', length: 1000, unique: true }) // Stock Keeping Unit
  sku: string;

  @Column({
    type: 'decimal',
    scale: 2,
    precision: 10,
    default: 0.0,
  })
  price_adjustment: number;

  @OneToMany(() => ProductImage, (image) => image.product_variant)
  product_images: ProductImage[];

  @Column({ default: 0 })
  stock_quantity: number;

  @Column({ nullable: true })
  image_url?: string;

  @OneToMany(() => VariantAttribute, (va) => va.variant)
  variantAttributes: VariantAttribute[];
}
