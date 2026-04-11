import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 👈 імпорт
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './сategories/сategories.module';
import { CartModule } from './cart/cart.module';
import { DeliverySlotsModule } from './delivery-slots/delivery-slots.module';
import { ProductsModule } from "./products/products.module";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { appDataSourceOptions } from './config/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',   // піднімаємось на рівень вище
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot(appDataSourceOptions),
    CategoriesModule,
    CartModule,
    ProductsModule,
    DeliverySlotsModule,
    ProductsModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
