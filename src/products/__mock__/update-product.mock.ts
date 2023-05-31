import { categoryEntityMock } from '../../categories/__mocks__/category.mock';
import { UpdateProductDTO } from '../dto/update-product';

export const updateProductMock: UpdateProductDTO = {
  categoryId: categoryEntityMock.id,
  image: 'lkfdjsafkldsa',
  name: 'name mock product',
  price: 25.0,
};