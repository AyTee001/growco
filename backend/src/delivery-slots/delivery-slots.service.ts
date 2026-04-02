import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, QueryFailedError, Repository } from 'typeorm';
import { DeliverySlots } from '../entities/DeliverySlots';
import { Orders } from '../entities/Orders';
import { CreateDeliverySlotDto } from './dto/create-delivery-slot.dto';
import { UpdateDeliverySlotDto } from './dto/update-delivery-slot.dto';

@Injectable()
export class DeliverySlotsService {
  constructor(
    @InjectRepository(DeliverySlots)
    private readonly deliverySlotsRepository: Repository<DeliverySlots>
  ) { }

  async findToday() {
    const now = new Date();

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await this.deliverySlotsRepository.find({
      where: {
        startTime: Between(now, endOfDay),
        isAvailable: true,
      },
      order: {
        startTime: 'ASC',
      },
    });
  }

  private assertValidRange(startTime: Date, endTime: Date) {
    if (endTime.getTime() <= startTime.getTime()) {
      throw new BadRequestException('endTime must be later than startTime');
    }
  }

  async create(createDto: CreateDeliverySlotDto) {
    this.assertValidRange(createDto.startTime, createDto.endTime);

    const slot = this.deliverySlotsRepository.create({
      startTime: createDto.startTime,
      endTime: createDto.endTime,
      isAvailable: createDto.isAvailable ?? true,
    });

    try {
      return await this.deliverySlotsRepository.save(slot);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Failed to create delivery slot');
      }
      throw error;
    }
  }

  async findAll() {
    return this.deliverySlotsRepository.find({
      order: { slotId: 'ASC' },
    });
  }

  async findOne(slotId: number) {
    const slot = await this.deliverySlotsRepository.findOne({
      where: { slotId },
      relations: ['orders'],
    });

    if (!slot) {
      throw new NotFoundException(`Delivery slot with id ${slotId} not found`);
    }

    return slot;
  }

  async update(slotId: number, updateDto: UpdateDeliverySlotDto) {
    const slot = await this.deliverySlotsRepository.findOne({
      where: { slotId },
    });

    if (!slot) {
      throw new NotFoundException(`Delivery slot with id ${slotId} not found`);
    }

    const nextStartTime =
      updateDto.startTime !== undefined ? updateDto.startTime : slot.startTime;

    const nextEndTime =
      updateDto.endTime !== undefined ? updateDto.endTime : slot.endTime;

    if (nextStartTime && nextEndTime) {
      this.assertValidRange(nextStartTime, nextEndTime);
    }

    if (updateDto.startTime !== undefined) {
      slot.startTime = updateDto.startTime;
    }

    if (updateDto.endTime !== undefined) {
      slot.endTime = updateDto.endTime;
    }

    if (updateDto.isAvailable !== undefined) {
      slot.isAvailable = updateDto.isAvailable;
    }

    try {
      return await this.deliverySlotsRepository.save(slot);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Failed to update delivery slot');
      }
      throw error;
    }
  }

  async remove(slotId: number) {
    const slot = await this.deliverySlotsRepository.findOne({
      where: { slotId },
      relations: ['orders'],
    });

    if (!slot) {
      throw new NotFoundException(`Delivery slot with id ${slotId} not found`);
    }

    if (slot.orders.length > 0) {
      throw new BadRequestException(
        'Cannot delete delivery slot that is used in orders',
      );
    }

    await this.deliverySlotsRepository.delete(slotId);

    return {
      message: `Delivery slot with id ${slotId} deleted successfully`,
    };
  }
}
