import { DataSource } from 'typeorm';
import { Categories } from '../entities/Categories';
import { CATEGORIES_SEED_DATA } from '../data/categories.seed-data';
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

async function seed() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'root',
        database: 'postgres',
        entities: [Categories, Products, Addresses, Cart, CartItems, DeliverySlots, LoyaltyTransactions, OrderItems, Orders, Products, Stores, Users],
        ssl: false,
    });

    await dataSource.initialize();
    const repo = dataSource.getRepository(Categories);

    console.log('Seeding categories...');

    for (const data of CATEGORIES_SEED_DATA) {
        const exists = await repo.findOneBy({ name: data.name });
        if (!exists) {
            const category = repo.create(data);
            await repo.save(category);
        }
    }

    console.log('Seeding complete!');
    await dataSource.destroy();
}

seed().catch((error) => console.log(error));