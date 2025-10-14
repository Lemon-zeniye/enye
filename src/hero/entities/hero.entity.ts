import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Hero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Welcome to Our Clothing Brand' })
  title: string;

  @Column({ default: 'Discover the latest trends in fashion', nullable: true })
  description?: string;

  @Column('text', { array: true, default: [] })
  imageUrls: string[];

  @Column({ default: 'Shop Now', nullable: true })
  ctaText?: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  showText?: boolean;

  @Column({ default: '/shop', nullable: true })
  ctaLink?: string;

  @Column({ type: 'float', default: 0.4, nullable: true })
  overlayOpacity?: number;

  @Column({ default: '#ffffff', nullable: true })
  textColor?: string;

  @Column({ nullable: true, default: '#000000' })
  ctaColor?: string;

  @Column({ nullable: true, default: '#ffffff' })
  ctaTextColor?: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  isActive?: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;
}
