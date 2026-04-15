import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Products } from '../entities/Products';
import { WeeklyProductGeneratorService } from './weekly-generator.service';

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  controllers: [ProductsController],
  providers: [ProductsService, WeeklyProductGeneratorService],
  exports: [ProductsService],
})
export class ProductsModule {}