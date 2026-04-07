import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../../database';
import { CreateMinister } from './create';
import { ListMinistersByChurch } from './list-by-church';
import { GetMinister } from './get';
import { GetMinisterByUserAndChurch } from './get-by-user-and-church';
import { DeleteMinister } from './delete';

const useCases = [
  CreateMinister,
  ListMinistersByChurch,
  GetMinister,
  GetMinisterByUserAndChurch,
  DeleteMinister,
];

@Module({
  imports: [DataBaseModule],
  providers: [...useCases],
  exports: [...useCases],
})
export class MinisterModule { }
