import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeliverySlots } from '../entities/DeliverySlots';
import { DateTime } from 'luxon';

@Injectable()
export class SlotGeneratorService implements OnModuleInit {
  private readonly START_HOUR = 9;
  private readonly END_HOUR = 22;
  private readonly TIMEZONE = 'Europe/Kyiv';

  constructor(
    @InjectRepository(DeliverySlots)
    private readonly repo: Repository<DeliverySlots>,
  ) {}

  async onModuleInit() {
    await this.generateSlots(14);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Europe/Kyiv' })
  async handleCron() {
    console.log('Running scheduled slot generation...');
    await this.generateSlots(14);
  }

  async generateSlots(daysAhead: number = 14) {
    const todayKyiv = DateTime.now().setZone(this.TIMEZONE).startOf('day');

    for (let i = 0; i <= daysAhead; i++) {
      const targetDate = todayKyiv.plus({ days: i });
      const startOfDayUtc = targetDate.startOf('day').toUTC().toJSDate();
      const endOfDayUtc = targetDate.endOf('day').toUTC().toJSDate();

      const count = await this.repo.count({
        where: {
          startTime: Between(startOfDayUtc, endOfDayUtc),
        },
      });

      if (count === 0) {
        console.log(`Generating slots for ${targetDate.toISODate()}`);
        await this.createStandardDaySlots(targetDate);
      }
    }
  }

  private async createStandardDaySlots(targetDate: DateTime) {
    const slots: DeliverySlots[] = [];

    for (let hour = this.START_HOUR; hour < this.END_HOUR; hour++) {
      const startKyiv = targetDate.set({ hour: hour, minute: 0, second: 0, millisecond: 0 });
      const endKyiv = targetDate.set({ hour: hour + 1, minute: 0, second: 0, millisecond: 0 });

      const startUtcDate = startKyiv.toUTC().toJSDate();
      const endUtcDate = endKyiv.toUTC().toJSDate();

      slots.push(
        this.repo.create({
          startTime: startUtcDate,
          endTime: endUtcDate,
          isAvailable: true,
        }),
      );
    }

    await this.repo.save(slots);
  }
}