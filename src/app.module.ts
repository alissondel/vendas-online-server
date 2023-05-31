import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatesModule } from './states/states.module';
import { CitiesModule } from './cities/cities.module';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { CartProductsModule } from './cart-products/cart-products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
      migrations: [`${__dirname}/migration/{.ts,*.js}`],
      migrationsRun: true,
    }),
    UsersModule,
    StatesModule,
    CitiesModule,
    AddressModule,
    AuthModule,
    JwtModule,
    CategoriesModule,
    ProductsModule,
    CartsModule,
    CartProductsModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: RolesGuard
  }],
})
export class AppModule {}
