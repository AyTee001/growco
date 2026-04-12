import { DataSource } from 'typeorm';
import { Stores } from '../entities/Stores';
import { fullDataSourceOptions } from '../config/typeorm';

const runSeed = async () => {
  console.log('Підключення до бази даних...');
  const dataSource = new DataSource(fullDataSourceOptions);
  await dataSource.initialize();
  console.log('Базу даних успішно підключено.');

  const storesRepo = dataSource.getRepository(Stores);

  const storeData = {
    name: 'Retail Hub ДАРНИЦЯ',
    city: 'Київ',
    street: 'проспект Миколи Бажана',
    houseNumber: '17',
    workingHours: '08:00 - 22:00',
    lat: '50.4025120',
    lng: '30.6540340',
  };
  
  const existingStore = await storesRepo.findOne({
    where: {
      city: storeData.city,
      street: storeData.street,
      houseNumber: storeData.houseNumber,
    },
  });

  if (!existingStore) {
    const store = storesRepo.create(storeData);
    await storesRepo.save(store);
    console.log(
      `Магазин успішно додано: ${store.name}, ${store.city}, ${store.street} ${store.houseNumber}`,
    );
  } else {
    console.log(
      `Магазин за адресою ${storeData.city}, ${storeData.street} ${storeData.houseNumber} вже існує в базі.`,
    );
  }

  await dataSource.destroy();
  console.log('Відключено від бази даних.');
};

runSeed().catch((err) => {
  console.error('Помилка під час сідінгу магазину:', err);
  process.exit(1);
});
