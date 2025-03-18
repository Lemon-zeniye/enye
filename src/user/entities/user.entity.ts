import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { Driver } from 'src/driver/entities/driver.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserType,
    // default: UserType.SHIPPER,
  })
  user_type: UserType;

  @Column()
  phone_number: number;

  @Column()
  password: string;

  @OneToOne(() => Driver, (driver) => driver.user)
  @JoinColumn()
  driver: Driver;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
