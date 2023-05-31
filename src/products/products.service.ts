import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { UpdateProductDTO } from './dto/update-product';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService
  ) {}

  async getProduct(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id
      }
    })

    if(!product){
      throw new NotFoundException(`Not found product id: ${id}`)
    }

    return product
  }

  async getProducts(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      order: {
        id: 'desc',
      },
      //take: 2 -> List in 2 products for request
    })

    if(!products || products.length === 0) {
      throw new NotFoundException('Not Found products')
    } 

    return products
  }

  async create(data: CreateProductDto): Promise<ProductEntity> {
    await this.categoryService.getCategoryById(data.categoryId)
    return await this.productRepository.save(data)
  }

  async update(id: number, data: UpdateProductDTO): Promise<ProductEntity> {
    const product = await this.getProduct(id)
    
    return await this.productRepository.save({
      ...product,
      ...data
    })
  }

  async delete(id: number): Promise<ProductEntity> {
    const product = await this.getProduct(id)

    return await this.productRepository.remove(product);
  }
}
