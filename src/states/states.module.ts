import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StateEntity } from './entities/state.entity';
import { StateService } from './states.service';
import { StateController } from './states.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StateEntity])],
  controllers: [StateController],
  providers: [StateService]
})
export class StatesModule {}
