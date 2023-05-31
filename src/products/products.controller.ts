import { Controller, Get, Post, Delete, Body, Param, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../users/enum/user-type.enum';
import { ReturnProductDto } from './dto/return-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDTO } from './dto/update-product';

@Roles(UserType.Admin, UserType.User)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserType.Admin)
  @Get(':id')
  product(@Param('id') id: string) {
    return this.productsService.getProduct(+id);
  }

  @Get()
  async products(): Promise<ReturnProductDto[]> {
    return (await this.productsService.getProducts()).map((product) => new ReturnProductDto(product));
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(@Body() data: CreateProductDto): Promise<ProductEntity> {
    return await this.productsService.create(data);
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateProductDTO) {
    return this.productsService.update(+id, data);
  }

  @Roles(UserType.Admin)
  @Delete(':id')
  deleteProduct(@Param('id') id: string): Promise<ProductEntity> {
    return this.productsService.delete(+id);
  }
}
