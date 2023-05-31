import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { CartProductEntity } from './entities/cart-product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCartDto } from '../carts/dto/insert-cart.dto';
import { CartEntity } from '../carts/entities/cart.entity';
import { ProductsService } from '../products/products.service';
import { UpdateCartDto } from '../carts/dto/update-cart.dto';


@Injectable()
export class CartProductsService {
  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productService: ProductsService
  ) {}

    async VerifyProductInCart(productId: number, cartId: number):Promise<CartProductEntity> {
      const cartProduct = await this.cartProductRepository.findOne({
        where: {
          productId,
          cartId
        }
      })

      if(!cartProduct) {
        throw new NotFoundException('Product not found in cart')
      }

      return cartProduct
    }

    async createCartProduct(insertCartDto: InsertCartDto, cartId: number):Promise<CartProductEntity> {
      return this.cartProductRepository.save({
        amount: insertCartDto.amount,
        productId: insertCartDto.productId,
        cartId
      })
    }

  async insert(data: InsertCartDto, cart: CartEntity):Promise<CartProductEntity> {
    await this.productService.getProduct(data.productId)

    const cartProduct = await this.VerifyProductInCart(data.productId, cart.id).catch(
      async () => undefined)

    if(!cartProduct) {
      return this.createCartProduct(data, cart.id)
    }

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: cartProduct.amount + data.amount
    })
  }

  async updateProductInCart(
    updateCartDTO: UpdateCartDto,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    await this.productService.getProduct(updateCartDTO.productId);

    const cartProduct = await this.VerifyProductInCart(
      updateCartDTO.productId,
      cart.id,
    );

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: updateCartDTO.amount,
    });
  }

  deleteProductInCart(productId: number, cartId: number): Promise<DeleteResult> {
    return this.cartProductRepository.delete({ productId, cartId })
  }
}
