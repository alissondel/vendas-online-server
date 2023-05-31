import { ProductEntity } from '../entities/product.entity'
import { categoryEntityMock } from '../../categories/__mocks__/category.mock'

export const productEntityMock: ProductEntity = {
  id: 1,
  categoryId: categoryEntityMock.id,
  name: 'product 1',
  price: 666,
  image: 'https://github.com/alissondel.png',
  createdAt: new Date(),
  updatedAt: new Date()
}