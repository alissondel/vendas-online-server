import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheService } from '../../cache/cache.service';
import { Repository } from 'typeorm';
import { CityService } from '../cities.service';
import { CityEntity } from '../entities/city.entity';
import { cityEntityMock } from '../__mock__/city.mock';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<CityEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue([cityEntityMock]),
          },
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cityEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cityRepository).toBeDefined();
  });

  it('should return findOne City', async () => {
    const city = await service.getCity(cityEntityMock.id);

    expect(city).toEqual(cityEntityMock);
  });

  it('should return error findOne not found', async () => {
    jest.spyOn(cityRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.getCity(cityEntityMock.id)).rejects.toThrowError();
  });

  it('should return Cities in getAllCitiesByStateId', async () => {
    const city = await service.getAllCitiesByStateId(cityEntityMock.id);

    expect(city).toEqual([cityEntityMock]);
  });
});