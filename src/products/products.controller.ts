import { 
  Get, 
  Put, 
  Body, 
  Post, 
  Param, 
  Delete, 
  UsePipes,
  Controller, 
  ValidationPipe,
  Query, 
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../users/enum/user-type.enum';
import { ReturnProductDto } from './dto/return-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDTO } from './dto/update-product';
import { ReturnPriceDeliveryDto } from './dto/return-price-delivery.dto';
import { Pagination } from '../dtos/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Get('/:id')
  product(@Param('id') id: string): Promise<ReturnProductDto> {
    return this.productsService.getProduct(+id, true);
  }

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Get('/page')
  async findAllPage(
    @Query('search') search?: string,
    @Query('size') size?: number,
    @Query('page') page?: number,
  ): Promise<Pagination<ReturnProductDto[]>> {
    return this.productsService.findAllPage(search, size, page);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get()
  async products(): Promise<ReturnProductDto[]> {
    return (await this.productsService.getProducts([], true)).map(
      (product) => new ReturnProductDto(product),
    );
  }

  @Get('/:idProduct/delivery/:cep')
  async findPriceDelivery(
    @Param('idProduct') idProduct: number,
    @Param('cep') cep: string,
  ): Promise<ReturnPriceDeliveryDto> {
    return this.productsService.findPriceDelivery(cep, idProduct)
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(@Body() data: CreateProductDto): Promise<ProductEntity> {
    return await this.productsService.create(data);
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateProductDTO) {
    return this.productsService.update(+id, data);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Delete(':id')
  deleteProduct(@Param('id') id: string): Promise<ProductEntity> {
    return this.productsService.delete(+id);
  }
}
