import { productEntityMock } from '../../products/__mock__/product.mock';
import { UpdateCartDto } from '../dto/update-cart.dto';

export const updateCartMock: UpdateCartDto = {
  amount: 54638,
  productId: productEntityMock.id,
};