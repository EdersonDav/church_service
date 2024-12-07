import { Module } from '@nestjs/common';
import { UseCasesModule } from './use-cases';

const modules = [UseCasesModule];

@Module({
  imports: modules,
  exports: modules,
})
export class CoreModule {}
