import {
  Controller,
  Get,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Stores } from '../entities/Stores';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список усіх магазинів' })
  @ApiOkResponse({ type: [Stores] })
  findAll() {
    return this.storesService.findAll();
  }
}
