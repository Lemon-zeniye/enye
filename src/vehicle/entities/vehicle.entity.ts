import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Unit, VehicleStatus, VehicleType } from '../enums/vehicle-type.enum';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  vehicle_type: VehicleType;

  @Column({ type: 'varchar', length: 20, unique: true })
  license_plate: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacity: string;

  @Column({ type: 'enum', enum: Unit, default: Unit.TONS })
  unit: Unit;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
  })
  vehicle_status: VehicleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
