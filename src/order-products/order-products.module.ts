import { Module } from '@nestjs/common';
import { OrderProductsService } from './order-products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProductEntity } from './entities/order-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProductEntity])],
  providers: [OrderProductsService],
  exports: [OrderProductsService],
})
export class OrderProductsModule {}
