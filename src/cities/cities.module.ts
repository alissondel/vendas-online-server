import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheModule } from '../cache/cache.module';
import { CityEntity } from './entities/city.entity';
import { CityService } from './cities.service';
import { CityController } from './cities.controller';

@Module({
  imports: [CacheModule, TypeOrmModule.forFeature([CityEntity])],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CitiesModule {}
