import { Module } from '@nestjs/common';
import { CreateSector } from './create';
import { GetSector } from './get';
import { UpdateSector } from './update';
import { DeleteSector } from './delete';
import { DataBaseModule } from '../../../database';

const useCases = [CreateSector, GetSector, UpdateSector, DeleteSector];

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [...useCases],
  exports: [...useCases],
})
export class SectorModule { }
