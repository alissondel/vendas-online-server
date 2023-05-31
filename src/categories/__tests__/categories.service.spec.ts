import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryEntityMock } from '../__mocks__/category.mock';
import { CreateCategoryDto } from '../dto/create-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, 
      {
        provide: getRepositoryToken(CategoryEntity),
        useValue: {
          findOne: jest.fn().mockResolvedValue(categoryEntityMock),
          find: jest.fn().mockResolvedValue([categoryEntityMock]),
          save: jest.fn().mockResolvedValue(categoryEntityMock),
        }
      }
    ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  it('should return list category', async () => {
    const categories = await service.getCategories()
    expect(categories).toEqual([categoryEntityMock])
  });

  it('should return error in list category empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);
    expect(service.getCategories()).rejects.toThrowError()
  });

  it('should return error in list category exception', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());
    expect(service.getCategories()).rejects.toThrowError()
  });

  // it('should return category after save', async () => {
  //   const category = await service.create(CreateCategoryDto)
  //   expect(category).toEqual(categoryEntityMock)
  // });

  it('should return error category in exception', async () => {
    jest.spyOn(categoryRepository, 'save').mockRejectedValue(new Error());
    expect(service.create(CreateCategoryDto)).rejects.toThrowError()
  });

  it('should return id category in get findById', async () => {
    const categoryId = await service.getCategoryById(categoryEntityMock.id)
    expect(categoryId).toEqual(categoryEntityMock)
  });

  it('should return error if category get findById', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined)
    expect(service.getCategoryById(categoryEntityMock.id)).rejects.toThrowError()
  });

  it('should return name category in get findByName', async () => {
    const categoryName = await service.getCategoryByName(categoryEntityMock.name)
    expect(categoryName).toEqual(categoryEntityMock)
  });

  it('should return error if category get findByName is empty', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined)
    expect(service.getCategoryByName(categoryEntityMock.name)).rejects.toThrowError()
  });
});
