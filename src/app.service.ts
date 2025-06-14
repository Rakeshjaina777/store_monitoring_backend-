import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(`port Running on `, process.env.Port);
   
    return 'Hello World!';
  }
}
