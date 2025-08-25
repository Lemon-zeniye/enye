import {
  Column,
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

  @Column()
  productId: number; // Added product ID field

  @Column({ type: 'varchar', length: 1000, unique: true })
  sku: string;

  @Column({
    type: 'decimal',
    scale: 2,
    precision: 10,
    default: 0.0,
  })
  price_adjustment: number;

  @Column({
    type: 'decimal',
    scale: 2,
    precision: 10,
    nullable: true,
  })
  old_price_adjustment?: number;

  @Column({ default: 0 })
  stock_quantity: number;

  @Column({ nullable: true })
  image_url?: string;

  @OneToMany(() => ProductImage, (image) => image.product_variant, {
    cascade: true,
  })
  product_images: ProductImage[];

  @OneToMany(() => VariantAttribute, (va) => va.variant, {
    cascade: true,
  })
  variantAttributes: VariantAttribute[];
}
