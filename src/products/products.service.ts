import { Injectable, NotFoundException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ILike, In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { UpdateProductDTO } from './dto/update-product';
import { CountProductDto } from './dto/count-product.dto';
import { SizeProductDto } from '../correios/dto/size-product.dto';
import { CorreiosService } from '../correios/correios.service';
import { CdServiceEnum } from '../correios/enums/cd-service.enum';
import { ReturnPriceDeliveryDto } from './dto/return-price-delivery.dto';
import { Pagination, PaginationMeta } from '../dtos/pagination.dto';

const DEFAULT_PAGE_SIZE = 10;
const FIRST_PAGE = 1;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoriesService))
    private readonly categoryService: CategoriesService,

    private readonly correiosService: CorreiosService
  ) {}

  async getProduct(id: number, isRelations?: boolean): Promise<ProductEntity> {
    const relations = isRelations
    ? {
        category: true,
      }
    : undefined;

    const product = await this.productRepository.findOne({
      where: {
        id
      },
      relations
    })

    if(!product){
      throw new NotFoundException(`Not found product id: ${id}`)
    }

    return product
  }

  async findAllPage(
    search?: string,
    size = DEFAULT_PAGE_SIZE,
    page = FIRST_PAGE,
  ): Promise<Pagination<ProductEntity[]>> {
    const skip = (page - 1) * size;
    let findOptions = {};
    if (search) {
      findOptions = {
        where: {
          name: ILike(`%${search}%`),
        },
      };
    }
    const [products, total] = await this.productRepository.findAndCount({
      ...findOptions,
      take: size,
      skip,
    });

    return new Pagination(
      new PaginationMeta(
        Number(size),
        total,
        Number(page),
        Math.ceil(total / size),
      ),
      products,
    );
  }

  async findPriceDelivery(cep: string, idProduct: number): Promise<any> {
    const product = await this.getProduct(idProduct)

    const sizeProduct = new SizeProductDto(product)

    const resultPrice = await Promise.all([
      this.correiosService.findPriceDelivery(CdServiceEnum.PAC, cep, sizeProduct),
      this.correiosService.findPriceDelivery(CdServiceEnum.SEDEX, cep, sizeProduct),
      this.correiosService.findPriceDelivery(CdServiceEnum.SEDEX_10, cep, sizeProduct),
    ]).catch(() => {
      throw new BadRequestException('Error find delivery price');
    });

    return new ReturnPriceDeliveryDto(resultPrice)
  }

  async getProducts(
    productId?: number[], 
    isFindRelations?: boolean,
    ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    if (isFindRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true,
        },
      };
    }

    const products = await this.productRepository.find(findOptions)

    if(!products || products.length === 0) {
      throw new NotFoundException('Not Found products')
    } 

    return products
  }

  async countProdutsByCategoryId(): Promise<CountProductDto[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id, COUNT(*) as total')
      .groupBy('product.category_id')
      .getRawMany();
  }

  async create(data: CreateProductDto): Promise<ProductEntity> {
    await this.categoryService.getCategoryById(data.categoryId)
    return this.productRepository.save({
      ...data,
      weight: data.weight || 0,
      width: data.width || 0,
      length: data.length || 0,
      diameter: data.diameter || 0,
      height: data.height || 0,
    })
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
