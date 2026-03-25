import { DataSource } from 'typeorm';
import { Categories } from '../entities/Categories';
import { CATEGORIES_SEED_DATA } from '../data/categories.seed-data';
import { fullDataSourceOptions } from '../config/typeorm';

async function seed() {
    const dataSource = new DataSource(fullDataSourceOptions);

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