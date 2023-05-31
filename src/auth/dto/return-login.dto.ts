import { ReturnUserDto } from '../../users/dto/return-user.dto';

export interface ReturnLogin {
  user: ReturnUserDto;
  accessToken: string;
}