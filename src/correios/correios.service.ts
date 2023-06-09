import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { AxiosError } from 'axios';
import { ReturnCepDtoExternal } from './dto/return-cep-external.dto';
import { CityService } from '../cities/cities.service';
import { ReturnCepDto } from './dto/return-cep.dto';
import { CityEntity } from '../cities/entities/city.entity';
import { Inject } from '@nestjs/common';
import { Client } from 'nestjs-soap';
import { ResponsePriceCorreiosDto } from './dto/response-price-correios';
import { CdFormatEnum } from './enums/cd-format.enum';
import { SizeProductDto } from './dto/size-product.dto';

@Injectable()
export class CorreiosService {
  URL_CORREIOS = process.env.URL_CEP_CORREIOS
  CEP_COMPANY = process.env.CEP_COMPANY
  constructor(
    @Inject('SOAP_CORREIOS') private readonly soapClient: Client,
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
    ) {}

  async findAddresByCep(cep: string): Promise<ReturnCepDto> {
    const cepData: ReturnCepDtoExternal = await this.httpService.axiosRef
      .get<ReturnCepDtoExternal>(this.URL_CORREIOS.replace('{CEP}', cep))
      .then((res) => {
        if(res.data.erro === "true") {
          throw new NotFoundException('CEP not found')
        }
        return res.data
      })
      .catch((error: AxiosError) => { 
        throw new BadRequestException(`Error in connection request ${error.message}`)
      })

    const city: CityEntity | undefined = await this.cityService
      .findCityByName(cepData.localidade, cepData.uf)
      .catch(() => undefined)

    return new ReturnCepDto(cepData, city?.id, city?.state?.id);
  }

  async findPriceDelivery(
    cdService: string,
    cep: string,
    sizeProduct: SizeProductDto
    ): Promise<ResponsePriceCorreiosDto> {
    return new Promise((resolve) => {
      this.soapClient.CalcPrecoPrazo({
        nCdServico: cdService,
        sCepOrigem: this.CEP_COMPANY,
        sCepDestino: cep,
        nVlFormato: CdFormatEnum.BOX,
        nVlPeso: sizeProduct.weight,
        nVlComprimento: sizeProduct.length,
        nVlAltura: sizeProduct.height,
        nVlLargura: sizeProduct.width,
        nVlDiametro: sizeProduct.diameter,
        nCdEmpresa: '',
        sDsSenha: '',
        sCsMaoPropria: 'N',
        nVlValorDeclarado: sizeProduct.productValue < 25 ? 0 : sizeProduct.productValue,
        sCdAvisoRecebimento: 'N',
      }, (_, res: ResponsePriceCorreiosDto) => {
        if(res){
          resolve(res);
        } else {
          throw new BadRequestException('Error SOAP')
        }
      })
    })
  }
}
