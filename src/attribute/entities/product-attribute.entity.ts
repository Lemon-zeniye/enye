import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AttributeValueEnum } from '../enums/attribute-value.enum';
import { AttributeValue } from './attribute-value.entity';

@Entity()
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: AttributeValueEnum,
    default: AttributeValueEnum.OTHER,
  })
  type: AttributeValueEnum;

  @OneToMany(() => AttributeValue, (value) => value.attribute)
  values: AttributeValue;
}
