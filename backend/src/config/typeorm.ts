import { DataSource, DataSourceOptions } from 'typeorm';
import { Categories } from '../entities/Categories';
import { Products } from '../entities/Products';
import { Addresses } from '../entities/Addresses';
import { Cart } from '../entities/Cart';
import { CartItems } from '../entities/CartItems';
import { DeliverySlots } from '../entities/DeliverySlots';
import { LoyaltyTransactions } from '../entities/LoyaltyTransactions';
import { OrderItems } from '../entities/OrderItems';
import { Orders } from '../entities/Orders';
import { Stores } from '../entities/Stores';
import { Users } from '../entities/Users';

export const appDataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'growco_db',
    entities: [Categories, Products, Addresses, Cart, CartItems, DeliverySlots, LoyaltyTransactions, OrderItems, Orders, Stores, Users],
    synchronize: false,
    ssl: false,
    logging: true
};

export const fullDataSourceOptions: DataSourceOptions = {
    ...appDataSourceOptions,
    migrations: ['src/migrations/*.ts']
}

const dataSource = new DataSource(fullDataSourceOptions);
export default dataSource;