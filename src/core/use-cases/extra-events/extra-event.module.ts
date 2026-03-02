import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../../database';
import { CreateExtraEvent } from './create';
import { ListExtraEventsByChurch } from './list-by-church';
import { GetExtraEvent } from './get';
import { UpdateExtraEvent } from './update';
import { DeleteExtraEvent } from './delete';

const useCases = [
  CreateExtraEvent,
  ListExtraEventsByChurch,
  GetExtraEvent,
  UpdateExtraEvent,
  DeleteExtraEvent,
];

@Module({
  imports: [DataBaseModule],
  providers: [...useCases],
  exports: [...useCases],
})
export class ExtraEventModule { }
