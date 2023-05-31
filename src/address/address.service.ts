
import { Repository } from 'typeorm'
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AddressEntity } from './entities/address.entity'
import { CreateAddressDto } from './dto/create-address.dto';
import { UsersService } from '../users/users.service';
import { CityService } from '../cities/cities.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UsersService,
    private readonly cityService: CityService
  ){}

  async create(data: CreateAddressDto, userId: number): Promise<AddressEntity> {
    await this.userService.getUser(userId)
    await this.cityService.getCity(data.cityId)
    return await this.addressRepository.save({
      ...data,
      userId
    });
  }

  async getAddressByUserId(userId: number): Promise<AddressEntity[]> {
    const addresses = await this.addressRepository.find({
      where: {
        userId
      },
      relations: {
        city: {
          state: true
        }
      }
    })

    if(!addresses || addresses.length === 0) {
      throw new NotFoundException(`Address ${userId} not found`)
    }

    return addresses
  }
  
}
