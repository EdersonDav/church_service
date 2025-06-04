import { Module } from '@nestjs/common';
import { CreateChurch } from './create';
import { DataBaseModule } from '../../../database';


@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [CreateChurch],
  exports: [CreateChurch],
})
export class ChurchModule { }
