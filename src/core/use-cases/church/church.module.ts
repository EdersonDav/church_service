import { Module } from '@nestjs/common';
import { CreateChurch } from './create';
import { DeleteChurch } from './delete';
import { DataBaseModule } from '../../../database';
import { UpdateChurch } from './update';
import { GetChurch } from './get';

const useCases = [
  CreateChurch,
  DeleteChurch,
  UpdateChurch,
  GetChurch
]

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: useCases,
  exports: useCases,
})
export class ChurchModule { }
