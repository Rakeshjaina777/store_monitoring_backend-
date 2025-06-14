import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
   imports: [PrismaModule],
})
export class ReportModule {}
