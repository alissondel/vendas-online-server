import { ReturnAddressDto } from '../../address/dto/return-address.dto';
import { UsersEntity } from '../entities/users.entity';

export class ReturnUserDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  addresses?: ReturnAddressDto[]

  constructor(userEntity: UsersEntity) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.phone = userEntity.phone;
    this.cpf = userEntity.cpf;
    this.addresses = userEntity.addresses ? userEntity.addresses.map((address) => new ReturnAddressDto(address)) : undefined;
  }
}