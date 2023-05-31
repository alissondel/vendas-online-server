import { JwtService } from '@nestjs/jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersEntity } from '../users/entities/users.entity';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

import { validatePassword } from '../utils/password';
import { LoginPayload } from './dto/login-payload.dto';
import { ReturnUserDto } from '../users/dto/return-user.dto';
import { ReturnLogin } from './dto/return-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLogin> {
    const user: UsersEntity | undefined = await this.userService
      .getUserByEmail(loginDto.email)
      .catch(() => undefined);

      const isMatch = await validatePassword(
        loginDto.password,
        user?.password || '',
      );

      if(!user || !isMatch){
        throw new NotFoundException('Email or password invalid')
      }

      return {
        accessToken: this.jwtService.sign({ ...new LoginPayload(user) }),
        user: new ReturnUserDto(user),
      };
  }
}
