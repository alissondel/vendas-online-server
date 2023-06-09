import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { PaymentCreditCardEntity } from './entities/payment-credit-card.entity';
import { PaymentType } from '../payment-status/enums/payment-type.enum';
import { PaymentPixEntity } from './entities/payment-pix.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { CartEntity } from '../carts/entities/cart.entity';
import { CartProductEntity } from '../cart-products/entities/cart-product.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>
  ){}

  generateFinalPrice(cart: CartEntity, products: ProductEntity[]): number {
    if (!cart.cartProducts || cart.cartProducts.length === 0) {
      return 0;
    }

    return Number(
      cart.cartProducts
        .map((cartProduct: CartProductEntity) => {
          const product = products.find(
            (product) => product.id === cartProduct.productId,
          );
          if (product) {
            return cartProduct.amount * product.price;
          }

          return 0;
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        .toFixed(2),
    );
  }

  async createPayment(
    data: CreateOrderDto, 
    products: ProductEntity[], 
    cart: CartEntity
  ): Promise<PaymentEntity> {
    const finalPrice = this.generateFinalPrice(cart, products);

    if(data.amountPayments){
      const paymentCreditCard = new PaymentCreditCardEntity(
        PaymentType.Done, 
        finalPrice, 
        0,
        finalPrice, 
        data
      )
      return this.paymentRepository.save(paymentCreditCard)
    } else if(data.codePix && data.datePayment){
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done, 
        finalPrice, 
        0, 
        finalPrice, 
        data
      )
      return this.paymentRepository.save(paymentPix)
    }

    throw new BadRequestException('Amount payments or code pix or date payment not found')
  }
}
