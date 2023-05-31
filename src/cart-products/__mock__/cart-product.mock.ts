import { cartEntityMock } from '../../carts/__mock__/cart.mock';
import { productEntityMock } from '../../products/__mock__/product.mock';
import { CartProductEntity } from '../entities/cart-product.entity';

export const cartProductMock: CartProductEntity = {
  amount: 5435,
  cartId: cartEntityMock.id,
  createdAt: new Date(),
  id: 234,
  productId: productEntityMock.id,
  updatedAt: new Date(),
};