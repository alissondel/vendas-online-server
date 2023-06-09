import { OrderEntity } from '../../orders/entities/order.entity';
import { AddressEntity } from '../../address/entities/address.entity';

import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column,
  CreateDateColumn, 
  OneToMany 
} from 'typeorm'

@Entity({ name: 'user'})
  export class UsersEntity{
  @PrimaryGeneratedColumn('rowid')
  id: number

  @Column({ nullable: false})
  name: string;

  @Column({ nullable: false})
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: false})
  cpf: string;

  @Column({ nullable: false})
  password: string;

  @Column({ name: 'type_user', nullable: false})
  typeUser: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses?: AddressEntity[];

  @OneToMany(() => OrderEntity, (order) => order.address)
  orders?: OrderEntity[];
}