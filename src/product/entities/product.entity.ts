import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from '../enums/gender-type.enum';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @OneToMany(() => ProductVariant, (product_variant) => product_variant.product)
  product_variants: ProductVariant[];

  @OneToMany(() => ProductImage, (images) => images.product)
  product_images: ProductImage[];

  @Column({ default: true })
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.UNISEX,
  })
  gender: Gender;

  @Column({ nullable: true })
  material?: string;

  @Column({ type: 'text', nullable: true })
  care_instructions?: string;

  @CreateDateColumn()
  created_at: Date;
}

// UsersModule → handles the Users table.

// CategoriesModule → handles categories and optionally Size_Guide.

// ProductsModule → handles Products, Product_Variants, Product_Images.

// AttributesModule → handles Product_Attributes, Attribute_Values, Variant_Attributes.
