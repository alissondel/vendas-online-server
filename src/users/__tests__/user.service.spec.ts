import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { UserType } from '../enum/user-type.enum';
import { UsersService } from '../users.service';
import { createUserMock } from '../__mocks__/createUser.mock';
import {
  updatePasswordInvalidMock,
  updatePasswordMock,
} from '../__mocks__/update-user.mock';
import { userEntityMock } from '../__mocks__/user.mock';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<UsersEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            save: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UsersEntity>>(
      getRepositoryToken(UsersEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should return user in findUserByEmail', async () => {
    const user = await service.getUserByEmail(userEntityMock.email);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserByEmail', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.getUserByEmail(userEntityMock.email),
    ).rejects.toThrowError();
  });

  it('should return error in findUserByEmail (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(
      service.getUserByEmail(userEntityMock.email),
    ).rejects.toThrowError();
  });

  it('should return user in findUserById', async () => {
    const user = await service.getUser(userEntityMock.id);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserById', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.getUserByEmail(userEntityMock.email),
    ).rejects.toThrowError();
  });

  it('should return error in findUserById (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(service.getUser(userEntityMock.id)).rejects.toThrowError();
  });

  it('should return user in getUserByIdUsingRelations', async () => {
    const user = await service.getUserByIdUsingRelations(userEntityMock.id);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error if user exist', async () => {
    expect(service.create(createUserMock)).rejects.toThrowError();
  });

  it('should return user if user not exist', async () => {
    const spy = jest.spyOn(userRepository, 'save');
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const user = await service.create(createUserMock);

    expect(user).toEqual(userEntityMock);
    expect(spy.mock.calls[0][0].typeUser).toEqual(UserType.User);
  });

  it('should return user if user not exist and user Admin', async () => {
    const spy = jest.spyOn(userRepository, 'save');
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    await service.create(createUserMock, UserType.Admin);

    expect(spy.mock.calls[0][0].typeUser).toEqual(UserType.Admin);
  });

  // it('should return user in update password', async () => {
  //   const user = await service.updatePassword(
  //     userEntityMock.id,
  //     updatePasswordMock
  //   );

  //   expect(user).toEqual(userEntityMock);
  // });

  it('should return invalid password in error', async () => {
    expect(
      service.updatePassword(userEntityMock.id, updatePasswordInvalidMock),
    ).rejects.toThrowError();
  });

  it('should return error in user not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.updatePassword(userEntityMock.id, updatePasswordMock),
    ).rejects.toThrowError();
  });
});