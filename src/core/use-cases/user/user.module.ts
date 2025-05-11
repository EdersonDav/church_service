import { Module } from '@nestjs/common';
import { CreateUser } from './create';
import { DataBaseModule } from '../../../database';

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [CreateUser],
  exports: [CreateUser],
})
export class UserModule { }
