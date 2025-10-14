// src/entities/ImageSection.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ImageSectionOrientation {
  LEFT = 'left',
  RIGHT = 'right',
}

@Entity()
export class ImageSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ImageSectionOrientation,
    default: ImageSectionOrientation.LEFT,
  })
  orientation: ImageSectionOrientation;

  @Column({ type: 'varchar', length: 255 })
  mainImage: string;

  @Column({ type: 'varchar', length: 255 })
  secondaryImage: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  buttonLabel: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  buttonLink: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
