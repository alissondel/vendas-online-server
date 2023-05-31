import { UpdatePasswordDTO } from '../dto/update-password.dto';

export const updatePasswordMock: UpdatePasswordDTO = {
  lastPassword: 'abc',
  newPassword: 'fdsafj',
};

export const updatePasswordInvalidMock: UpdatePasswordDTO = {
  lastPassword: 'lkfdjsa',
  newPassword: 'flkjbla',
};