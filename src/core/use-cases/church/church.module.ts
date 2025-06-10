import { Module } from '@nestjs/common';
import { CreateChurch } from './create';
import { DeleteChurch } from './delete';
import { DataBaseModule } from '../../../database';


@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [CreateChurch, DeleteChurch],
  exports: [CreateChurch, DeleteChurch],
})
export class ChurchModule { }
