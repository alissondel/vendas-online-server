import { stateEntityMock } from '../../states/__mock__/state.mock'
import { CityEntity } from '../entities/city.entity'

export const cityEntityMock: CityEntity = {
  id: 1,
  name: 'São Paulo',
  stateId: stateEntityMock.id,
  createdAt: new Date(),
  updatedAt: new Date()
}