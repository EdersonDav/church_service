import { Module } from '@nestjs/common';
import { GetHello } from './get';

@Module({
  exports: [GetHello],
  providers: [GetHello],
})
export class HelloModuleModule {}
