import { ReturnCartDto } from '../../carts/dto/return-cart.dto';
import { ReturnProductDto } from '../../products/dto/return-product.dto';
import { CartProductEntity } from '../entities/cart-product.entity';

export class ReturnCartProductDTO {
  id: number;
  cartId: number;
  productId: number;
  amount: number;
  product?: ReturnProductDto;
  cart?: ReturnCartDto;

  constructor(cartProduct: CartProductEntity) {
    this.id = cartProduct.id;
    this.cartId = cartProduct.cartId;
    this.productId = cartProduct.productId;
    this.amount = cartProduct.amount;
    this.product = cartProduct.product
      ? new ReturnProductDto(cartProduct.product)
      : undefined;
    this.cart = cartProduct.cart
      ? new ReturnCartDto(cartProduct.cart)
      : undefined;
  }
}
