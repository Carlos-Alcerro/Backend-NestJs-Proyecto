import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('text', { array: true, default: ['user'] })
  roles: string;

  @Column('bool', { default: true })
  IsActive: boolean;
}
