import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './сategories/сategories.module';
import { CartModule } from './cart/cart.module';
import { DeliverySlotsModule } from './delivery-slots/delivery-slots.module';
import { Addresses } from './entities/Addresses';
import { Cart } from './entities/Cart';
import { CartItems } from './entities/CartItems';
import { Categories } from './entities/Categories';
import { DeliverySlots } from './entities/DeliverySlots';
import { LoyaltyTransactions } from './entities/LoyaltyTransactions';
import { OrderItems } from './entities/OrderItems';
import { Orders } from './entities/Orders';
import { Products } from './entities/Products';
import { Stores } from './entities/Stores';
import { Users } from './entities/Users';
import { ProductsModule } from "./products/products.module";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { appDataSourceOptions } from './config/typeorm';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5438,
      username: 'postgres',
      password: '12345',
      database: 'postgres',
      synchronize: false,
      entities: [
        Addresses,
        Cart,
        CartItems,
        Categories,
        DeliverySlots,
        LoyaltyTransactions,
        OrderItems,
        Orders,
        Products,
        Stores,
        Users,
      ],
    }), TypeOrmModule.forRoot(appDataSourceOptions),
    CategoriesModule,
    CartModule,
    DeliverySlotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
