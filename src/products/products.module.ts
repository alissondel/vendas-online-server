import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { CorreiosModule } from '../correios/correios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    forwardRef(() => CategoriesModule),
    CorreiosModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
