import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from '../../config/configuration';
import { PrismaService } from 'prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';
import { StoreModule } from '../store/store.module';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { ReportModule } from '../report/report.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    StoreModule,
    ReportModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, LoggerService],
  exports: [PrismaService, LoggerService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
