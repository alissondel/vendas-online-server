import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { userEntityMock } from '../../users/__mocks__/user.mock';
import { JwtService } from '@nestjs/jwt';
import { jwtMock } from '../__mock__/jwt.mock';
import { loginUserMock } from '../__mock__/login-user.mock';
import { ReturnUserDto } from '../../users/dto/return-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, 
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn().mockResolvedValue(userEntityMock)
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => jwtMock
          }
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user if password email valid', async () => {
    const user = await service.login(loginUserMock)

    expect(user).toEqual({
      accessToken: jwtMock,
      user: new ReturnUserDto(userEntityMock),
    });
  });

  it('should return user if password invalid and email valid', async () => {
    expect(service.login({ email: 'foo@bar.com', password: '123456' }),).rejects.toThrowError()
  });

  it('should return user if email not exist', async () => {
    jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(undefined)

    //expect(service.login({ email: 'foo@bar.com', password: '123456' }),).rejects.toThrowError()
    expect(service.login(loginUserMock)).rejects.toThrowError()
  });

  it('should return error in userService', async () => {
    jest.spyOn(userService, 'getUserByEmail').mockRejectedValue(new Error())

    expect(service.login(loginUserMock)).rejects.toThrowError()
  });
  
});
