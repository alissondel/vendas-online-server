import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProductEntity } from './entities/order-product.entity';
import { ReturnGroupOrderDto } from './dto/return-group-order.dto';

@Injectable()
export class OrderProductsService {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>
  ){}

  async findAmountProductsByOrderId(
    orderId: number[],
  ): Promise<ReturnGroupOrderDto[]> {
    return this.orderProductRepository
      .createQueryBuilder('order_product')
      .select('order_product.order_id, COUNT(*) as total')
      .where('order_product.order_id IN (:...ids)', { ids: orderId })
      .groupBy('order_product.order_id')
      .getRawMany();
  }

  async createOrderProduct(
    productId: number, 
    orderId: number, 
    price: number, 
    amount: number
  ): Promise<OrderProductEntity> {
    return this.orderProductRepository.save({
      amount,
      orderId,
      price,
      productId,
    })
  }
}
