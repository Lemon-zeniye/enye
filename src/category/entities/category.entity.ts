import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  image_url: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent_category?: Category;

  @OneToOne(() => Category, (category) => category.parent_category)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn()
  created_at: Date;
}

// CREATE TABLE Categories (
//     category_id INT PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(100) NOT NULL,
//     description TEXT,
//     parent_category_id INT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     image_url VARCHAR(255),
//     FOREIGN KEY (parent_category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
// );
