import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { default: 'Sin Categoria' })
  nombre: string;

  @OneToMany(() => Product, (product) => product.categoria)
  producto: Product;
}
