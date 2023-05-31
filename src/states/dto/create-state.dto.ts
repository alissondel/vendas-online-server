import { StateEntity } from '../entities/state.entity';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  constructor(state: StateEntity) {
    this.name = state.name;
  }
}
