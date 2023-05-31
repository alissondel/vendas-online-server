import { userEntityMock } from "../../users/__mocks__/user.mock";
import { LoginDto } from "../dto/login.dto";

export const loginUserMock: LoginDto = {
  email: userEntityMock.email,
  password: '123456'
}