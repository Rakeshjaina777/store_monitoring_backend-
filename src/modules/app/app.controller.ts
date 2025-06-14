import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomHttpException } from '../../common/exceptions/http-exception';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/error')
  getError() {
    throw new CustomHttpException(
      'Something bad happened',
      HttpStatus.BAD_REQUEST,
    );
  }
}
