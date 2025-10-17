import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { Length, Min } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Order } from 'src/order/entities/order.entity';
import { Address } from './address.entity';

export enum SignupMethod {
  FORM = 'form',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  INACTIVE = 'inactive',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Transform(({ value }) => value.toUpperCase())
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.USER,
  })
  user_type: UserType;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Address, (address) => address.user)
  address: Address[];

  @Column({ nullable: true })
  @Length(10, 15)
  phone_number: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: SignupMethod,
    default: SignupMethod.FORM,
  })
  signup_method: SignupMethod;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
