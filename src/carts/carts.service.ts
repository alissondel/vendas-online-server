import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../users/enum/user-type.enum';
import { InsertCartDto } from './dto/insert-cart.dto';
import { CartProductsService } from '../cart-products/cart-products.service';
import { UpdateCartDto } from './dto/update-cart.dto';

const LINE_AFFECTED = 1

@Roles(UserType.User)
@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductService: CartProductsService
  ){}

  async findCartByUserId(
    userId: number,
    isRelations?: boolean,
  ): Promise<CartEntity> {
    const relations = isRelations
      ? {
        cartProducts: {
            product: true,
          },
        }
      : undefined;

    const cart = await this.cartRepository.findOne({
      where: {
        userId,
        active: true,
      },
      relations,
    });

    if (!cart) {
      throw new NotFoundException(`Cart active not found`);
    }

    return cart;
  }

  async createCart(userId: number): Promise<CartEntity> {
    return await this.cartRepository.save({
      active: true,
      userId, 
    })
  }

  async insert(userId: number, data: InsertCartDto): Promise<CartEntity> {
    const cart = await this.findCartByUserId(userId)
      .catch(async () => this.createCart(userId))

    await this.cartProductService.insert(data, cart)
    return cart
  }

  async updateProductInCart(
    updateCartDTO: UpdateCartDto,
    userId: number,
  ): Promise<CartEntity> {
    const cart = await this.findCartByUserId(userId).catch(async () => {
      return this.createCart(userId);
    });

    await this.cartProductService.updateProductInCart(updateCartDTO, cart);

    return cart;
  }

  async clearFullCart(userId: number): Promise<DeleteResult> {
    const cart = await this.findCartByUserId(userId)
    await this.cartRepository.save({
      ...cart,
      active: false,
    })

    return {
      raw: [],
      affected: LINE_AFFECTED
    }
  }

  async deleteProductCart(productId: number, userId: number): Promise<DeleteResult> {
    const cart = await this.findCartByUserId(userId)
    return this.cartProductService.deleteProductInCart(productId, cart.id)
  }
}
