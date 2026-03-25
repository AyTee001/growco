// ... imports
import { PRODUCTS_DATA } from 'src/data/products.seed-data';
import dataSource from '../config/typeorm';
import { Categories } from '../entities/Categories';
import { Products } from '../entities/Products';
import { In } from 'typeorm';

async function seed() {
  await dataSource.initialize();
  const categoryRepo = dataSource.getRepository(Categories);
  const productRepo = dataSource.getRepository(Products);

  console.log('Seeding products...');

  for (const data of PRODUCTS_DATA) {
    const categories = await categoryRepo.findBy({
      categoryId: In(data.categoryIds)
    });

    const product = productRepo.create({
      productId: data.productId,
      name: data.name,
      description: data.description,
      price: data.price,
      qtyInStock: data.qtyInStock,
      imgUrl: data.imgUrl,
      categories: categories
    });

    await productRepo.save(product);
  }

  await dataSource.query(`SELECT setval('products_product_id_seq', (SELECT MAX(product_id) FROM products))`);

  console.log('Seeding complete!');
  await dataSource.destroy();
}