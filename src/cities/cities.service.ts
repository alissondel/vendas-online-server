import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from '../cache/cache.service';
import { Repository } from 'typeorm';
import { CityEntity } from './entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,

    private readonly cacheService: CacheService,
  ) {}

  async getAllCitiesByStateId(stateId: number): Promise<CityEntity[]> {
    return this.cacheService.getCache<CityEntity[]>(`state_${stateId}`, () =>
      this.cityRepository.find({
        where: {
          stateId,
        },
      }),
    );
  }

  async getCity(id: number): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: {
        id,
      },
    });

    if (!city) {
      throw new NotFoundException(`CityId: ${id} not found.`);
    }

    return city;
  }

  async findCityByName(
    nameCity: string,
    nameState: string,
  ): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: {
        name: nameCity,
        state: {
          uf: nameState,
        },
      },
      relations: {
        state: true,
      },
    });

    if (!city) {
      throw new NotFoundException(`City not found.`);
    }

    return city;
  }
}