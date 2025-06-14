import { Module } from '@nestjs/common';

import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  controllers: [StoreController],
  providers: [StoreService],
  imports: [PrismaModule],
})
export class StoreModule {}
