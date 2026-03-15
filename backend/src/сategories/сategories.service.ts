import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, QueryFailedError, Repository } from 'typeorm';
import { Categories } from '../entities/Categories';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryRepository: Repository<Categories>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name.trim() },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${createCategoryDto.name}" already exists`,
      );
    }

    if (
      createCategoryDto.parentCategoryId !== undefined &&
      createCategoryDto.parentCategoryId !== null
    ) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { categoryId: createCategoryDto.parentCategoryId },
      });

      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with id ${createCategoryDto.parentCategoryId} not found`,
        );
      }
    }

    const category = this.categoryRepository.create({
      name: createCategoryDto.name.trim(),
      parentCategoryId: createCategoryDto.parentCategoryId ?? null,
      imgUrl: createCategoryDto.imgUrl ?? null,
    });

    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Failed to create category');
      }

      throw error;
    }
  }

  async findAll() {
    return this.categoryRepository.find({
      relations: ['parentCategory'],
      order: { categoryId: 'ASC' },
    });
  }

  async findAllTree() {
    return this.categoryRepository.find({
      where: { parentCategoryId: IsNull() },
      relations: ['categories', 'products'],
      order: { categoryId: 'ASC' },
    });
  }

  async findOne(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId },
      relations: ['parentCategory', 'categories', 'products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    return category;
  }

  async update(categoryId: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    if (updateCategoryDto.name !== undefined) {
      const trimmedName = updateCategoryDto.name.trim();

      if (!trimmedName) {
        throw new BadRequestException('Category name cannot be empty');
      }

      const existingCategory = await this.categoryRepository.findOne({
        where: { name: trimmedName },
      });

      if (existingCategory && existingCategory.categoryId !== categoryId) {
        throw new ConflictException(
          `Category with name "${trimmedName}" already exists`,
        );
      }

      category.name = trimmedName;
    }

    if (
      updateCategoryDto.parentCategoryId !== undefined &&
      updateCategoryDto.parentCategoryId !== null
    ) {
      if (updateCategoryDto.parentCategoryId === categoryId) {
        throw new BadRequestException(
          'Category cannot be its own parent category',
        );
      }

      const parentCategory = await this.categoryRepository.findOne({
        where: { categoryId: updateCategoryDto.parentCategoryId },
      });

      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with id ${updateCategoryDto.parentCategoryId} not found`,
        );
      }

      category.parentCategoryId = updateCategoryDto.parentCategoryId;
    }

    if (updateCategoryDto.parentCategoryId === null) {
      category.parentCategoryId = null;
    }

    if (updateCategoryDto.imgUrl !== undefined) {
      category.imgUrl = updateCategoryDto.imgUrl;
    }

    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Failed to update category');
      }

      throw error;
    }
  }

  async remove(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId },
      relations: ['categories'],
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    if (category.categories.length > 0) {
      throw new BadRequestException(
        'Cannot delete category that has child categories',
      );
    }

    await this.categoryRepository.delete(categoryId);

    return {
      message: `Category with id ${categoryId} deleted successfully`,
    };
  }
}
