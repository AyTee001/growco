import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

type DbTime = {
  now: string;
};

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkDb(): Promise<DbTime[]> {
    const result: DbTime[] = await this.dataSource.query('SELECT NOW()');
    return result;
  }
}
