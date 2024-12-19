import { Module } from '@nestjs/common';
import { HelloModuleModule } from './hello';
import { AuthModule } from './auth';
import { DataBaseModule } from '../../database';

const modules = [HelloModuleModule, AuthModule];

@Module({
  imports: [...modules, DataBaseModule],
  exports: modules,
})
export class UseCasesModule { }
