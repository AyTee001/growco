import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeliverySlots } from '../entities/DeliverySlots';

@Injectable()
export class SlotGeneratorService implements OnModuleInit {
    private readonly START_HOUR = 9;
    private readonly END_HOUR = 22;

    constructor(
        @InjectRepository(DeliverySlots)
        private readonly repo: Repository<DeliverySlots>,
    ) { }

    async onModuleInit() {
        await this.generateSlots(14);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        console.log('Running scheduled slot generation...');
        await this.generateSlots(14);
    }

    async generateSlots(daysAhead: number = 14) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i <= daysAhead; i++) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + i);

            const startOfDay = new Date(targetDate);
            const endOfDay = new Date(targetDate);
            endOfDay.setHours(23, 59, 59);

            const count = await this.repo.count({
                where: {
                    startTime: Between(startOfDay, endOfDay),
                },
            });

            if (count === 0) {
                console.log(`Generating slots for ${targetDate.toDateString()}`);
                await this.createStandardDaySlots(targetDate);
            }
        }
    }

    private async createStandardDaySlots(date: Date) {
        const slots: DeliverySlots[] = [];

        for (let hour = this.START_HOUR; hour < this.END_HOUR; hour++) {
            const startTime = new Date(date);
            startTime.setHours(hour, 0, 0, 0);

            const endTime = new Date(date);
            endTime.setHours(hour + 1, 0, 0, 0);

            slots.push(this.repo.create({
                startTime,
                endTime,
                isAvailable: true
            }));
        }

        await this.repo.save(slots);
    }
}