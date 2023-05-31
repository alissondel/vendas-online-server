import { ReturnStateDto } from '../../states/dto/return-state.dto';
import { CityEntity } from '../entities/city.entity';

export class ReturnCityDto {
  name: string;
  state?: ReturnStateDto;

  constructor(city: CityEntity) {
    this.name = city.name;
    this.state = city.state ? new ReturnStateDto(city.state) : undefined;
  }
}