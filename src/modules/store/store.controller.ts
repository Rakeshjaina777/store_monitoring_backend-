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
  create(@Body() body: CreateStoreDto) {
    return {
      message: 'Store created',
      store: body,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiResponse({ status: 200, description: 'Store details' })
  findOne(@Param('id') id: string) {
    return {
      id,
      name: 'Loop Pizza',
      timezone: 'America/New_York',
    };
  }
}
