import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productEntityMock } from '../__mock__/product.mock';
import { createProductMock } from '../__mock__/create-product.mock';
import { CategoriesService } from '../../categories/categories.service'
import { categoryEntityMock } from '../../categories/__mocks__/category.mock';
import { returnDeleteMock } from '../__mock__/return-product.mock';
import { updateProductMock } from '../__mock__/update-product.mock';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<ProductEntity>
  let categoryService: CategoriesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, 
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(productEntityMock),
            find: jest.fn().mockResolvedValue([productEntityMock]),
            findOne: jest.fn().mockResolvedValue(productEntityMock),
            remove: jest.fn().mockResolvedValue(returnDeleteMock),
          },      
        },
        {
          provide: CategoriesService,
          useValue: {
            getCategoryById: jest.fn().mockResolvedValue(categoryEntityMock)
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity))
    categoryService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('should return list all products', async () => {
    const products = await service.getProducts()
    expect(products).toEqual([productEntityMock]);
  });

  it('should return an error in list empty products', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValue([])
    expect(service.getProducts()).rejects.toThrowError();
  });

  it('should return an error in exception', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValue(new Error())
    expect(service.getProducts()).rejects.toThrowError();
  });

  it('should return an error in exception', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValue(new Error())
    expect(service.getProducts()).rejects.toThrowError();
  });

  it('should return product after insert in DB', async () => {
    const product = await service.create(createProductMock)
    expect(product).toEqual(productEntityMock)
  });

  it('should return error at find getCategoryById ', async () => {
    jest.spyOn(categoryService, 'getCategoryById').mockRejectedValue(new Error())
    expect(service.create(createProductMock)).rejects.toThrowError()
  });

  it('should return getProduct with success ', async () => {
    const product = await service.getProduct(productEntityMock.id)
    expect(product).toEqual(productEntityMock)
  });
  

  it('should return error in product no found ', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined)
    expect(service.getProduct(productEntityMock.id)).rejects.toThrowError()
  });

  it('should return getProduct with error ', async () => {
    jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error())
    expect(service.getProduct(productEntityMock.id)).rejects.toThrowError()
  });

  it('should return updateProduct with success ', async () => {
    const product = await service.update(productEntityMock.id, updateProductMock)
    expect(product).toEqual(productEntityMock)
  });

  it('should return updateProduct with error ', async () => {
    jest.spyOn(productRepository, 'save').mockRejectedValue(new Error())
    expect(service.update(productEntityMock.id, updateProductMock)).rejects.toThrowError()
  });

  it('should return deleteProduct with success ', async () => {
    const product = await service.delete(productEntityMock.id)
    expect(product).toEqual(returnDeleteMock)
  });
});
