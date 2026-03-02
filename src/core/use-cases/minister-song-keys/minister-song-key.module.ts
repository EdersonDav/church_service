import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../../database';
import { SetMinisterSongKeys } from './set';
import { ListMinisterSongKeys } from './list-by-minister';

const useCases = [
  SetMinisterSongKeys,
  ListMinisterSongKeys,
];

@Module({
  imports: [DataBaseModule],
  providers: [...useCases],
  exports: [...useCases],
})
export class MinisterSongKeyModule { }
