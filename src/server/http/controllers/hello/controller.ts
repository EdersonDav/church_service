import { Controller, Get } from '@nestjs/common';
import { GetHello } from '../../../../core/use-cases/hello';

@Controller()
export class HelloController {
  constructor(private readonly getHelloService: GetHello) {}

  @Get()
  getHello(): string {
    return this.getHelloService.execute();
  }
}
