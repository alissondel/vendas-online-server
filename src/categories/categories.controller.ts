import { Controller, Get, Post , UsePipes, ValidationPipe, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ReturnCategory } from './dto/return-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../users/enum/user-type.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async categories(): Promise<ReturnCategory[]> {
    return (await this.categoriesService.getCategories()).map((category) => new ReturnCategory(category))
  }

  @Roles(UserType.Admin, UserType.User)
  @Get(':name')
    async getCategoryByName(@Param('name') name: string): Promise<CategoryEntity> {
      return await this.categoriesService.getCategoryByName(name)
    }

  @UsePipes(ValidationPipe)
  @Roles(UserType.Admin, UserType.Root)
  @Post()
  async createCategory(@Body() data: CreateCategoryDto): Promise<CategoryEntity> {
    return await this.categoriesService.create(data)
  }
}
