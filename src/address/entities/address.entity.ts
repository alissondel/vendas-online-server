import { CityEntity } from '../../cities/entities/city.entity';
import { UsersEntity } from '../../users/entities/users.entity';

import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, CreateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm'

@Entity({ name: 'address' })
export class AddressEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number

  @Column({ name: 'user_id', nullable: false})
  userId: number;

  @Column({ nullable: true})
  complement: string;

  @Column({ name: 'number', nullable: false })
  numberAddress: number;

  @Column({ nullable: false})
  cep: string;

  @Column({ name: 'city_id', nullable: false})
  cityId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.addresses)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UsersEntity;

  @ManyToOne(() => CityEntity, (city) => city.addresses)
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city?: CityEntity;
}
