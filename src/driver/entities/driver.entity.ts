import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DriverStatus } from '../enums/driver-status.enum';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  license_number: string;

  @Column()
  license_expiry_date: Date;

  @Column()
  years_of_experience: Date;

  @Column({
    type: 'enum',
    enum: DriverStatus,
    // default: DriverStatus.AVAILABLE,
  })
  status: DriverStatus;

  @OneToOne(() => User, (user) => user.driver)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
