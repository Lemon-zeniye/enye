// entities/Cart.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CartItem } from './cartItem.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
    eager: true, // Auto-load items with cart
  })
  items: CartItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to calculate total
  calculateTotal(): void {
    this.total = this.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }
}
