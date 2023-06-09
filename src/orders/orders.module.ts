import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { PaymentsModule } from '../payments/payments.module';
import { CartsModule } from '../carts/carts.module';
import { OrderProductsModule } from '../order-products/order-products.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]), 
    PaymentsModule, 
    CartsModule, 
    OrderProductsModule,
    ProductsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
