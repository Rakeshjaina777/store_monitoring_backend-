import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateStoreDto } from 'src/common/dto/store.dto';
import { StoreService } from './store.service';

@ApiTags('Stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({ status: 201, description: 'Store created successfully' })
  async create(@Body() body: CreateStoreDto) {
    const store = await this.storeService.createStore(body);
    return {
      message: 'Store created',
      store,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiResponse({ status: 200, description: 'Store details' })
  async findOne(@Param('id') id: string) {
    const store = await this.storeService.getStoreById(id);
    return store;
  }

  @Get(':id/uptime-last-hour')
  @ApiOperation({ summary: 'Get store uptime/downtime for the last hour' })
  @ApiResponse({ status: 200, description: 'Uptime and downtime in minutes' })
  async getUptimeLastHour(@Param('id') id: string) {
    return this.storeService.getStoreUptimeLastHour(id);
  }
}
