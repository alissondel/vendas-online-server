import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from '../carts.service';
import { CartEntity } from '../entities/cart.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CartsService', () => {
  let service: CartsService;
  let cartRepository: Repository<CartEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService, 
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {}
        }
      ],
    }).compile();

    service = module.get<CartsService>(CartsService);
    cartRepository = module.get<Repository<CartEntity>>(getRepositoryToken(CartEntity))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartRepository).toBeDefined();
  });
});
