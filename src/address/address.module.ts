import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressEntity } from './entities/address.entity';
import { UsersModule } from '../users/users.module';
import { CitiesModule } from '../cities/cities.module';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity]), UsersModule, CitiesModule],
  controllers: [AddressController],
  providers: [AddressService]
})
export class AddressModule {}
