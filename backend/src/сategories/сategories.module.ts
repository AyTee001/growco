import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Додано цей імпорт
import { CategoriesService } from './сategories.service'; // Виправлено "С"
import { Categories } from '../entities/Categories'; // Ваша сутність
import { CategoriesController } from './сategories.controller'; // Виправлено "С"

@Module({
  imports: [TypeOrmModule.forFeature([Categories])], // Тепер TypeOrmModule знайдено
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
