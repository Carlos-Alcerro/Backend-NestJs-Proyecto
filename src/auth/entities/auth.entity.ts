import { Product } from 'src/products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: true })
  password: string;

  @Column('text')
  name: string;

  @Column('int', { default: null })
  telefono?: number;

  @Column('text', { default: 'Sin direccion' })
  direccion?: string;

  @Column('text', { array: true, default: ['user'] })
  roles?: string[];

  @Column('bool', { default: true })
  IsActive: boolean;

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  checkFielsInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldUpdate() {
    this.checkFielsInsert();
  }
}
