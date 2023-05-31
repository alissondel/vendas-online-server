import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StateService } from '../states.service'
import { StateEntity } from '../entities/state.entity'
import { stateEntityMock } from '../__mock__/state.mock';

describe('statesService', () => {
  let service: StateService;
  let stateRepository: Repository<StateEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StateService, {
        provide: getRepositoryToken(StateEntity),
        useValue: {
          find: jest.fn().mockResolvedValue([stateEntityMock]),
        }
      }],
    }).compile();

    service = module.get<StateService>(StateService);
    stateRepository = module.get<Repository<StateEntity>>(getRepositoryToken(StateEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(stateRepository).toBeDefined();
  });

  it('should return list of states', async () => {
    const states = await service.getStates();
    expect(states).toEqual([stateEntityMock])
  });

  it('should return error in exception', async () => {
    jest.spyOn(stateRepository, 'find').mockRejectedValue(new Error());
    expect(service.getStates()).rejects.toThrowError()
  });
  
});
