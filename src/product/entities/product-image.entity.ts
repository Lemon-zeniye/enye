import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.product_images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => ProductVariant, (variant) => variant.product_images, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  product_variant?: ProductVariant;

  @Column()
  image_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt_text?: string;

  @Column({ default: false })
  is_primary: boolean;

  @Column({ default: 0 })
  display_order: number;

  @Column({ nullable: true })
  product_variant_id?: number;
}
