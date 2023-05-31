import { categoryEntityMock } from '../../categories/__mocks__/category.mock';
import { CreateProductDto } from '../dto/create-product.dto';

export const createProductMock: CreateProductDto = {
  categoryId: categoryEntityMock.id,
  image: 'lkfdjsafkldsa',
  name: 'name mock product',
  price: 25.0,
};