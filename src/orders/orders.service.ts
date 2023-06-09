import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentsService } from '../payments/payments.service';
import { PaymentEntity } from '../payments/entities/payment.entity';
import { CartsService } from '../carts/carts.service';
import { OrderProductsService } from '../order-products/order-products.service';
import { ProductsService } from '../products/products.service';
import { OrderProductEntity } from '../order-products/entities/order-product.entity';
import { CartEntity } from '../carts/entities/cart.entity';
import { ProductEntity } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentsService,
    private readonly cartService: CartsService,
    private readonly orderProductService: OrderProductsService,
    private readonly productService: ProductsService
  ){}

  async findOrdersByUserId(
    userId?: number,
    orderId?: number,
  ): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      where: {
        userId,
        id: orderId,
      },
      relations: {
        address: {
          city: {
            state: true,
          }
        },
        ordersProduct: {
          product: true,
        },
        payment: {
          paymentStatus: true,
        },
        user: !!orderId,
      }
    })

    if(!orders || orders.length === 0){
      throw new NotFoundException('Orders not found')
    }

    return orders
  }

  async findAllOrders(): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      relations: {
        user: true,
      },
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('Orders not found');
    }

    const ordersProduct =
      await this.orderProductService.findAmountProductsByOrderId(
        orders.map((order) => order.id),
      );

    return orders.map((order) => {
      const orderProduct = ordersProduct.find(
        (currentOrder) => currentOrder.order_id === order.id,
      );

      if (orderProduct) {
        return {
          ...order,
          amountProducts: Number(orderProduct.total),
        };
      }
      return order;
    });
  }

  async saveOrder(
    data: CreateOrderDto, 
    userId: number, 
    payment: PaymentEntity
  ): Promise<OrderEntity> {
    return this.orderRepository.save({
      addressId: data.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId
    })
  }

  async createOrderProductUsingCart(
    cart: CartEntity,
    orderId: number,
    products: ProductEntity[],
  ): Promise<OrderProductEntity[]> {
    return Promise.all(
      cart.cartProducts?.map((cartProduct) =>
        this.orderProductService.createOrderProduct(
          cartProduct.productId,
          orderId,
          products.find((product) => product.id === cartProduct.productId)
            ?.price || 0,
          cartProduct.amount,
        ),
      ),
    );
  }

  async createOrder(
    data: CreateOrderDto, 
    userId: number,
    ): Promise<OrderEntity> {
    const cart = await this.cartService.findCartByUserId(userId, true)
    
    const products = await this.productService.getProducts(
      cart.cartProducts?.map((cartProduct) => cartProduct.productId))

    const payment: PaymentEntity = await this.paymentService.createPayment(
      data,
      products,
      cart,
    )
    
    const order: OrderEntity = await this.saveOrder(data, userId, payment);
    
    await this.createOrderProductUsingCart(cart, order.id, products)

    await this.cartService.clearFullCart(userId)

    return order
  }
}
