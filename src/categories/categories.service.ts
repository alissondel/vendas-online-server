import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ){}

  async getCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find()

    if(!categories || categories.length === 0) {
      throw new NotFoundException('Do not exists categories!')
    }
    
    return categories;
  }

  async getCategoryById(id: number): Promise<CategoryEntity> {
    const categoryId = await this.categoryRepository.findOne({
      where: {
        id
      }
    })

    if(!categoryId) {
      throw new NotFoundException(`category id ${id} does not exist`)
    }
    
    return categoryId;
  }

  async getCategoryByName(name: string): Promise<CategoryEntity> {
    const categoryName = await this.categoryRepository.findOne({
      where: {
        name
      }
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

}
