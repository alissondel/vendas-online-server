import { Controller, Post, Get, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../users/enum/user-type.enum';
import { UserId } from '../decorators/user-id-decorator';
import { AddressEntity } from './entities/address.entity';
import { ReturnAddressDto } from './dto/return-address.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() data: CreateAddressDto,
    @UserId() userId: number
    ): Promise<AddressEntity> {
    return this.addressService.create(data, userId);
  }

  @Get()
    async getAddressByUserId(userId: number): Promise<ReturnAddressDto[]> {
      return (await this.addressService.getAddressByUserId(userId)).map((address) => new ReturnAddressDto(address))
    }
}
