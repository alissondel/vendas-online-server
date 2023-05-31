import { productEntityMock } from '../../products/__mock__/product.mock';
import { InsertCartDto } from '../dto/insert-cart.dto';

export const insertCartMock: InsertCartDto = {
  amount: 535,
  productId: productEntityMock.id,
};