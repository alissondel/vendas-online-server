import { UsersEntity } from '../entities/users.entity'
import { UserType } from '../enum/user-type.enum'

export const userEntityMock: UsersEntity = {
  id: 1,
  name: 'Alisson Delatim',
  email: 'alisson@email.com',
  password: '$2b$10$gxNiZQm0h1ifCRYSlPVNy.8ugsYqmN3WI8R2Bp/TwSJjLNVkTTE76',
  cpf: '123.123.123-12',
  phone: '(17)99778-4947',
  typeUser: UserType.User,
  createdAt: new Date(),
  updatedAt: new Date()
}