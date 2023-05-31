import { Repository } from 'typeorm';
import { Injectable, NotFoundException, BadGatewayException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/users.entity';
import { createPasswordHashed, validatePassword } from '../utils/password';
import { UserType } from './enum/user-type.enum';
import { UpdatePasswordDTO } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>
  ) {}

  async getUser(id: number): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`UserId: ${id} Not Found`);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`Email: ${email} Not Found`);
    }

    return user;
  }

  async getUserByIdUsingRelations(id: number): Promise<UsersEntity> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
  }

  async getUsers(): Promise<UsersEntity[]> {
    const user = await this.usersRepository.find()

    if(!user) throw new Error('State not found');

    return user
  }

  async create(data: CreateUserDto, userType?: number): Promise<UsersEntity> {
    const user = await this.getUserByEmail(data.email).catch(
      () => undefined,
    );

    if (user) {
      throw new BadGatewayException('Email registered in system');
    }

    const passwordHashed = await createPasswordHashed(data.password);

    return this.usersRepository.save({
      ...data,
      typeUser: userType ? userType : UserType.User,
      password: passwordHashed,
    });
  }

  async updatePassword(userId: number, data: UpdatePasswordDTO): Promise<UsersEntity> {
    const user = await this.getUser(userId)

    const passwordHashed = await createPasswordHashed(data.newPassword);

    const isMatch = await validatePassword(data.lastPassword, user.password || '')

    if(!isMatch){
      throw new BadRequestException('Last password invalid')
    }

    return this.usersRepository.save({
      ...user,
      password: passwordHashed,
    })
  }
}
