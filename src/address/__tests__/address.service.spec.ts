import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from '../entities/address.entity';
import { AddressService } from '../address.service';
import { addressEntityMock } from '../__mock__/address.mock';
import { UsersService } from '../../users/users.service';
import { userEntityMock } from '../../users/__mocks__/user.mock';
import { CityService } from '../../cities/cities.service';
import { cityEntityMock } from '../../cities/__mock__/city.mock';
import { createAddressMock } from '../__mock__/create-address.mock';

describe('AddressService', () => {
  let service: AddressService;
  let userService: UsersService;
  let cityService: CityService;
  let addressRepository: Repository<AddressEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressService, 
        {
          provide: UsersService,
          useValue: {
            getUser: jest.fn().mockResolvedValue(userEntityMock)
          },
        },
        {
          provide: CityService,
          useValue: {
            getCity: jest.fn().mockResolvedValue(cityEntityMock)
          },
        },
        {
        provide: getRepositoryToken(AddressEntity),
        useValue: {
          save: jest.fn().mockResolvedValue(addressEntityMock),
          find: jest.fn().mockResolvedValue([addressEntityMock]),
        }
      }],
    }).compile();

    service = module.get<AddressService>(AddressService);
    userService = module.get<UsersService>(UsersService);
    cityService = module.get<CityService>(CityService);
    addressRepository = module.get<Repository<AddressEntity>>(getRepositoryToken(AddressEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(cityService).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  it('should return address after save', async () => {
    const address = await service.create(createAddressMock, userEntityMock.id)
    expect(address).toEqual(addressEntityMock);
  })

  it('should return error if execption in userService', async () => {
    jest.spyOn(userService, 'getUser').mockRejectedValueOnce(new Error())

    expect(service.create(createAddressMock, userEntityMock.id)).rejects.toThrowError()
  })

  it('should return error if execption in cityService', async () => {
    jest.spyOn(cityService, 'getCity').mockRejectedValueOnce(new Error())

    expect(service.create(createAddressMock, userEntityMock.id)).rejects.toThrowError()
  })

  it('should return all address to user', async () => {
    const addresses = await service.getAddressByUserId(userEntityMock.id)
    expect(addresses).toEqual([addressEntityMock]);
  })

  it('should return all address to user', async () => {
    jest.spyOn(addressRepository, 'find').mockResolvedValue(undefined)

    expect(service.getAddressByUserId(userEntityMock.id)).rejects.toThrowError()
  })
  
});
