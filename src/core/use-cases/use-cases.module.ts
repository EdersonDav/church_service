import { Module } from '@nestjs/common';
import { HelloModuleModule } from './hello';

const modules = [HelloModuleModule];

@Module({
  imports: modules,
  exports: modules,
})
export class UseCasesModule {}
