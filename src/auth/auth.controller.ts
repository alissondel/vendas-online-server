import { Controller, UsePipes, ValidationPipe, Body, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ReturnLogin } from './dto/return-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  @UsePipes(ValidationPipe)
  @Post()
  async login(
    @Body() loginDto: LoginDto
  ): Promise<ReturnLogin> {
    return await this.authService.login(loginDto)
  }
}
