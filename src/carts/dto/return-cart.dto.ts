import { CartEntity } from "../entities/cart.entity";
import { ReturnCartProductDTO } from "../../cart-products/dto/return-cart-product.dto";

export class ReturnCartDto {
  id: number;
  cartProduct?: ReturnCartProductDTO[]

  constructor(cart: CartEntity) {
    this.id = cart.id,
    this.cartProduct = cart.cartProducts
      ? cart.cartProducts.map(
        (cartProduct) => new ReturnCartProductDTO(cartProduct))
      : undefined
  }
}