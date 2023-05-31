import { userEntityMock } from '../../users/__mocks__/user.mock'
import { AddressEntity } from '../entities/address.entity'
import { cityEntityMock } from '../../cities/__mock__/city.mock'

export const addressEntityMock: AddressEntity = {
  id: 1,
  userId: userEntityMock.id,
  complement: 'Complemento',
  numberAddress: 666,
  cep: '15606-666',
  cityId: cityEntityMock.id,
  createdAt: new Date(),
  updatedAt: new Date()
}