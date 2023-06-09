import { Controller, Get, Post, Put, Delete , UsePipes, ValidationPipe, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ReturnCategory } from './dto/return-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../users/enum/user-type.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Roles(UserType.Admin, UserType.User, UserType.Root)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/:categoryId')
  async findCategoryById(
    @Param('categoryId') categoryId: number,
  ): Promise<ReturnCategory> {
    return new ReturnCategory(
      await this.categoriesService.getCategoryById(categoryId, true),
    );
  }

  @Roles(UserType.Admin, UserType.User, UserType.Root)
  @Get('/names/:name')
    async getCategoryByName(@Param('name') name: string): Promise<CategoryEntity> {  
      return await this.categoriesService.getCategoryByName(name, true)
    }

  @Get()
  async categories(): Promise<ReturnCategory[]> {
    return this.categoriesService.getCategories();
  }

  @UsePipes(ValidationPipe)
  @Roles(UserType.Admin, UserType.Root)
  @Post()
  async createCategory(@Body() data: CreateCategoryDto): Promise<CategoryEntity> {
    return await this.categoriesService.create(data)
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Put(':categoryId')
  async editCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateCategory: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoriesService.updateCategory(categoryId, updateCategory);
  }


  @Roles(UserType.Admin, UserType.Root)
  @Delete(':categoryId')
  async deleteCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<DeleteResult> {
    return this.categoriesService.deleteCategory(categoryId);
  }
}
