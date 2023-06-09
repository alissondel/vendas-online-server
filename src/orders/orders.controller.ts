import { 
  Controller, 
  Param, Get, 
  Post, 
  Body, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';

import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../users/enum/user-type.enum';
import { UserId } from '../decorators/user-id-decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { ReturnOrderDTO } from './dto/return-order.dto';

@Roles(UserType.Admin, UserType.Root)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findOrdersByUserId(
    @UserId() userId: number
  ): Promise<OrderEntity[]> {
    return this.ordersService.findOrdersByUserId(userId)
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/all')
  async findAllOrders(): Promise<ReturnOrderDTO[]> {
    return (await this.ordersService.findAllOrders()).map(
      (order) => new ReturnOrderDTO(order),
    );
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/:orderId')
  async findOrderById(
    @Param('orderId') orderId: number,
  ): Promise<ReturnOrderDTO> {
    return new ReturnOrderDTO(
      (await this.ordersService.findOrdersByUserId(undefined, orderId))[0],
    );
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() data: CreateOrderDto,
    @UserId() userId: number,
  ) {
    return this.ordersService.createOrder(data, userId)
  }
}
