import { Controller, Get } from '@nestjs/common';
import { StateEntity } from './entities/state.entity';
import { StateService } from './states.service';

@Controller('states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  async states(): Promise<StateEntity[]> {
    return this.stateService.getStates();
  }
}