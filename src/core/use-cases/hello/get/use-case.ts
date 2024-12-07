import { Injectable } from '@nestjs/common';

@Injectable()
export class GetHello {
  execute(): string {
    return 'Hello World! Test';
  }
}
