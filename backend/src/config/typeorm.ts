import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';


export const appDataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'growco_db',
    
    entities: [path.join(__dirname, '/../entities/**/*.{ts,js}')],
    
    synchronize: process.env.DB_SYNC === 'true',
    logging: process.env.DB_LOGGING === 'true',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

export const fullDataSourceOptions: DataSourceOptions = {
    ...appDataSourceOptions,
    migrations: [path.join(__dirname, '/../migrations/**/*.{ts,js}')],
};

const dataSource = new DataSource(fullDataSourceOptions);
export default dataSource;