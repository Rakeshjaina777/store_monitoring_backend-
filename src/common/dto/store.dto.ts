import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsEnum,
} from 'class-validator';
import { StoreActivityStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: 'Loop Pizza', description: 'Name of the store' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'America/New_York',
    description: 'IANA timezone string (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}
export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}

export class CreateStoreStatusDto {
  @ApiProperty({ enum: StoreActivityStatus, description: 'Activity status' })
  @IsEnum(StoreActivityStatus)
  status: StoreActivityStatus;

  @ApiProperty({
    example: '2025-06-13T15:00:00Z',
    required: false,
    description: 'Timestamp (optional); defaults to current time',
  })
  @IsOptional()
  @IsString()
  timestamp?: string;
}