import { Module } from '@nestjs/common';
import { UseCasesModule } from './use-cases';
import { DataBaseModule } from '../database';

const modules = [UseCasesModule];

@Module({
  imports: [...modules, DataBaseModule],
  exports: [...modules],
})
export class CoreModule { }
