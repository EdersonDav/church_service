import { Module } from '@nestjs/common';
import { CreateUserChurch } from './create';
import { DataBaseModule } from '../../../database';
import { GetUserChurch } from './get';

const useCases = [
  CreateUserChurch,
  GetUserChurch,
];

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [...useCases],
  exports: [...useCases],
})
export class UserChurchModule { }
