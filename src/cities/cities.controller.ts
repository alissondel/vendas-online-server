import { Controller, Get, Param } from '@nestjs/common';
import { CityService } from './cities.service';
import { CityEntity } from './entities/city.entity';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('/:stateId')
  async getAllCitiesByStateId(
    @Param('stateId') stateId: number,
  ): Promise<CityEntity[]> {
    return this.cityService.getAllCitiesByStateId(stateId);
  }
}