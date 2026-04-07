import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../../database';
import { SetScaleSongs } from './set';
import { ListScaleSongs } from './list-by-scale';
import { RecalculateScaleSongKeys } from './recalculate-keys';

const useCases = [
  SetScaleSongs,
  ListScaleSongs,
  RecalculateScaleSongKeys,
];

@Module({
  imports: [DataBaseModule],
  providers: [...useCases],
  exports: [...useCases],
})
export class ScaleSongModule { }
