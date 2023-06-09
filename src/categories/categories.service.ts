import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ProductsService } from '../products/products.service';
import { ReturnCategory } from './dto/return-category.dto';
import { CountProductDto } from '../products/dto/count-product.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly productService: ProductsService
  ){}

  findAmountCategoryInProducts(category: CategoryEntity, countList: CountProductDto[]): number {
    const count = countList.find(
      (itemCount) => itemCount.category_id === category.id)

    if(count) {
      return count.total
    }

    return 0
  }

  async getCategories(): Promise<ReturnCategory[]> {
    const categories = await this.categoryRepository.find()

    const count = await  this.productService.countProdutsByCategoryId()

    if(!categories || categories.length === 0) {
      throw new NotFoundException('Do not exists categories!')
    }
    
    return categories.map(
      (category) =>
        new ReturnCategory(
          category,
          this.findAmountCategoryInProducts(category, count),
        ),
    );
  }

  async getCategoryById(id: number, isRelations?: boolean ): Promise<CategoryEntity> {
    const relations = isRelations
    ? {
        products: true,
      }
    : undefined;

    const categoryId = await this.categoryRepository.findOne({
      where: {
        id
      },
      relations
    })

    if(!categoryId) {
      throw new NotFoundException(`category id ${id} does not exist`)
    }
    
    return categoryId;
  }

  async getCategoryByName(name: string, isRelations?: boolean): Promise<CategoryEntity> {
    const relations = isRelations
    ? {
        products: true,
      }
    : undefined;

    const categoryName = await this.categoryRepository.findOne({
      where: {
        name
      },
      relations
    })

    if(!categoryName) {
      throw new NotFoundException(`category name ${name} does not exist`)
    }
    
    return categoryName;
  }

  async create(data: CreateCategoryDto): Promise<CategoryEntity> {
    const nameCategory = await this.getCategoryByName(data.name).catch(() => undefined)

    if(nameCategory) {
      throw new BadRequestException(`category name ${data.name} already exists`)
    }

    return await this.categoryRepository.save(data)
  }

  async updateCategory(
    categoryId: number,
    updateCategory: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.getCategoryById(categoryId);

    return this.categoryRepository.save({
      ...category,
      ...updateCategory,
    });
  }
  
  async deleteCategory(categoryId: number): Promise<DeleteResult> {
    const category = await this.getCategoryById(categoryId, true);

    if (category.products?.length > 0) {
      throw new BadRequestException('Category with relations.');
    }

    return this.categoryRepository.delete({ id: categoryId });
  }

}
