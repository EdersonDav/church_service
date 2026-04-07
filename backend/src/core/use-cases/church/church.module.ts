import { Module } from '@nestjs/common';
import { CreateChurch } from './create';
import { DeleteChurch } from './delete';
import { DataBaseModule } from '../../../database';
import { UpdateChurch } from './update';
import { GetChurch } from './get';
import { ListChurches } from './list';

const useCases = [
  CreateChurch,
  DeleteChurch,
  UpdateChurch,
  GetChurch,
  ListChurches
]

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: useCases,
  exports: useCases,
})
export class ChurchModule { }
