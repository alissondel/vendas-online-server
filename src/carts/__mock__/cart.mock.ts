import { userEntityMock } from '../../users/__mocks__/user.mock';
import { CartEntity } from '../entities/cart.entity';

export const cartEntityMock: CartEntity = {
  id: 64363,
  userId: userEntityMock.id,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};