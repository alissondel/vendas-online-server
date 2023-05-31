import { Test, TestingModule } from '@nestjs/testing';
import { CartProductsService } from '../cart-products.service';
import { ProductsService } from '../../products/products.service';
import { Repository } from 'typeorm';
import { CartProductEntity } from '../entities/cart-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productEntityMock } from '../../products/__mock__/product.mock';
import { returnDeleteMock } from '../../products/__mock__/return-product.mock';
import { cartEntityMock } from '../../carts/__mock__/cart.mock';
import { cartProductMock } from '../__mock__/cart-product.mock';
import { insertCartMock } from 'src/carts/__mock__/insert-cart.mock';
import { NotFoundException } from '@nestjs/common';

describe('CartProductsService', () => {
  let service: CartProductsService;
  let cartProductRepository: Repository<CartProductEntity>
  let productService: ProductsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartProductsService, 
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cartProductMock),
            save: jest.fn().mockResolvedValue(cartProductMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          }
        },
        {
          provide: ProductsService,
          useValue: {
            findProductById: jest.fn().mockResolvedValue(productEntityMock)
          }
        }
      ],
    }).compile();

    service = module.get<CartProductsService>(CartProductsService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(getRepositoryToken(CartProductEntity))
    productService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartProductRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return DELETE result after delete product', async () => {
    const deleteResult = await service.deleteProductInCart(productEntityMock.id, cartEntityMock.id)
    expect(deleteResult).toEqual(returnDeleteMock)
  });

  it('should return ERROR in exception delete', async () => {
    jest.spyOn(cartProductRepository, 'delete').mockRejectedValue(new Error())
    expect(
      service.deleteProductInCart(productEntityMock.id, cartEntityMock.id))
      .rejects.toThrowError()
  });

  it('should return CartProduct after create', async () => {
    const productCart = await service.createCartProduct(
      insertCartMock,
      cartEntityMock.id,
    );

    expect(productCart).toEqual(cartProductMock);
  });

  it('should return error in exception delete', async () => {
    jest.spyOn(cartProductRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.createCartProduct(insertCartMock, cartEntityMock.id),
    ).rejects.toThrowError();
  });

  it('should return CartProduct if exist', async () => {
    const productCart = await service.VerifyProductInCart(
      productEntityMock.id,
      cartEntityMock.id,
    );

    expect(productCart).toEqual(cartProductMock);
  });

  it('should return error if not found', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.VerifyProductInCart(productEntityMock.id, cartEntityMock.id),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return error in exception verifyProductInCart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

    expect(
      service.VerifyProductInCart(productEntityMock.id, cartEntityMock.id),
    ).rejects.toThrowError(Error);
  });

  it('should return error in exception verifyProductInCart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

    expect(
      service.VerifyProductInCart(productEntityMock.id, cartEntityMock.id),
    ).rejects.toThrowError(Error);
  });

  it('should return error in exception insertProductInCart', async () => {
    jest
      .spyOn(productService, 'getProduct')
      .mockRejectedValue(new NotFoundException());

    expect(
      service.insert(insertCartMock, cartEntityMock),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return cart product if not exist cart', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    const cartProduct = await service.insert(
      insertCartMock,
      cartEntityMock,
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0].amount).toEqual(insertCartMock.amount);
  });

});
