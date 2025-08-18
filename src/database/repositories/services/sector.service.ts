import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Sector } from '../../entities';
import { SectorRepository } from '../interfaces';

@Injectable()
export class SectorService implements SectorRepository {
  private onConflictConfig: any = {
    conflictPaths: ['name', 'church'],
    skipUpdateIfNoValuesChanged: true,
    upsertType: 'on-conflict-do-update',
  }
  constructor(
    @InjectRepository(Sector)
    private readonly entity: TypeORMRepository<Sector>
  ) { }

  async save(sector: Partial<Sector>): Promise<Sector> {
    const sectorCreated = this.entity.create(sector);
    await this.entity.upsert(sectorCreated, this.onConflictConfig);
    return sectorCreated;
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }
}
