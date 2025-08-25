import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from '../enums/gender-type.enum';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { Group } from 'src/groups/entities/group.entity';

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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  old_price?: number;

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

  @Column({ type: 'json', nullable: true })
  material?: string[];

  @Column({ type: 'json', nullable: true })
  care_instructions?: string[];

  @ManyToMany(() => Group, (group) => group.products)
  groups: Group[];

  @CreateDateColumn()
  created_at: Date;
}
