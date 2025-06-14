import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();

  const config = new DocumentBuilder()
    .setTitle('Store Monitoring Backend')
    .setDescription('API docs for monitoring uptime/downtime of stores')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: '*', // Allow all origins for development; adjust as needed for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });
  
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // Allow credentials if needed

  
  await app.listen(process.env.PORT || 3001);

  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3001}`);
}
bootstrap();
