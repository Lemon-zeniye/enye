import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @ManyToOne(() => User, (user) => user.address)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'boolean', default: true, nullable: true })
  isDefault?: boolean;
}
