import { 
  Controller, 
  Get,
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';

import { CartsService } from './carts.service';
import { InsertCartDto } from './dto/insert-cart.dto';
import { UserId } from '../decorators/user-id-decorator';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../users/enum/user-type.enum';
import { ReturnCartDto } from './dto/return-cart.dto';
import { DeleteResult } from 'typeorm';
import { UpdateCartDto } from './dto/update-cart.dto';

@Roles(UserType.Admin, UserType.User, UserType.Root)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  async getCartByUserId(@UserId() userId: number): Promise<ReturnCartDto>{
    return new ReturnCartDto(await this.cartsService.findCartByUserId(userId, true)) 
  }

  @UsePipes(ValidationPipe)
  @Post()
  async insertCart(@UserId() userId: number,  @Body() data: InsertCartDto): Promise<ReturnCartDto> {
    return new ReturnCartDto(await this.cartsService.insert(userId, data))
  }
  
  @UsePipes(ValidationPipe)
  @Patch()
  async updateProductInCart(
    @Body() updateCartDTO: UpdateCartDto,
    @UserId() userId: number,
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartsService.updateProductInCart(updateCartDTO, userId),
    );
  }

  @Delete()
  async clearCart(@UserId() userId: number): Promise<DeleteResult>{
    return this.cartsService.clearFullCart(userId);
  }

  @Delete('/product/:productId')
  async deleteProductCart(@UserId() userId: number, @Param('productId') productId: number): Promise<DeleteResult>{
    return this.cartsService.deleteProductCart(productId, userId);
  }
}
