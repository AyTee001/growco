import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Products } from '../entities/Products';
import { DateTime } from 'luxon';

@Injectable()
export class WeeklyProductGeneratorService implements OnModuleInit {
  private readonly TIMEZONE = 'Europe/Kyiv';
  private readonly TOTAL_RANDOM_PRODUCTS = 30;
  private readonly MAX_PRODUCT_ID = 900;
  private readonly MIN_PRODUCT_ID = 1;

  private currentWeeklyProductIds: number[] = [];

  constructor(
    @InjectRepository(Products)
    private readonly productRepo: Repository<Products>,
  ) {}

  async onModuleInit() {
    console.log('Initial weekly product check...');
    await this.updateWeeklyProducts();
  }

  // Запуск щопонеділка опівночі
  @Cron('0 0 * * 1', { timeZone: 'Europe/Kyiv' })
  async handleCron() {
    console.log('Running scheduled weekly product generation...');
    await this.updateWeeklyProducts();
  }

  async updateWeeklyProducts() {
    const now = DateTime.now().setZone(this.TIMEZONE);

    const seedKey = `${now.year}-${now.weekNumber}`;

    this.currentWeeklyProductIds = this.generateDeterministicIds(seedKey);

    console.log(
      `Weekly products for ${seedKey}:`,
      this.currentWeeklyProductIds,
    );
  }

  private generateDeterministicIds(seed: string): number[] {
    const ids: Set<number> = new Set();

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    const random = (s: number) => {
      return () => {
        let t = (s += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };

    const getNextRandom = random(Math.abs(hash));

    while (ids.size < this.TOTAL_RANDOM_PRODUCTS) {
      const randomId = Math.floor(
        getNextRandom() * (this.MAX_PRODUCT_ID - this.MIN_PRODUCT_ID + 1) +
          this.MIN_PRODUCT_ID,
      );
      ids.add(randomId);
    }

    return Array.from(ids);
  }

  getWeeklyIds(): number[] {
    return this.currentWeeklyProductIds;
  }
}