import { Module } from '@nestjs/common';
import { CreateChurch } from './create';
import { DeleteChurch } from './delete';
import { DataBaseModule } from '../../../database';
import { UpdateChurch } from './update';

const useCases = [
  CreateChurch,
  DeleteChurch,
  UpdateChurch
]

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: useCases,
  exports: useCases,
})
export class ChurchModule { }
