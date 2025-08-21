import { Module } from '@nestjs/common';
import { CreateSector } from './create';
import { DataBaseModule } from '../../../database';

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [CreateSector],
  exports: [CreateSector],
})
export class SectorModule { }
