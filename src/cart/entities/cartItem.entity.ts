// entities/CartItem.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  // Reference to product, but no direct relation
  @Column()
  productId: number;

  // Snapshot data - preserves what user added to cart
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  // Helper method to update quantity
  updateQuantity(newQuantity: number): void {
    this.quantity = newQuantity;
  }
}
