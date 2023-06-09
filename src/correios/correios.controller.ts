import { Controller, Param, Get } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { ReturnCepDto } from './dto/return-cep.dto';

@Controller('correios')
export class CorreiosController {
  constructor(private readonly correiosService: CorreiosService) {}

  @Get(':cep')
  async findAll(@Param('cep') cep: string): Promise<ReturnCepDto>{
    return this.correiosService.findAddresByCep(cep);
  }
}
