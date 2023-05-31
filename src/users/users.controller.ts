import { Controller, Get, Post, Patch, Body, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UsersEntity } from './entities/users.entity';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { UserId } from '../decorators/user-id-decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async users(): Promise<ReturnUserDto[]> {
    return (await this.userService.getUsers()).map(
      (userEntity) => new ReturnUserDto(userEntity),
    );
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(
    @Body() data: CreateUserDto
  ): Promise<UsersEntity> {
    return this.userService.create(data)
  }

  @UsePipes(ValidationPipe)
  @Patch()
  async updatePasswordUser(
    @UserId() userId: number,
    @Body() data: UpdatePasswordDTO
  ): Promise<UsersEntity> {
    return this.userService.updatePassword(userId, data)
  }
}
