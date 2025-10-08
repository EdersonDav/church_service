import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Sector } from '../../entities';
import { SectorRepository } from '../interfaces';
import { UUID } from 'crypto';

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

  async update(sector_id: UUID, sector_set: Partial<Sector>): Promise<Sector | null> {
    const sector = await this.entity.findOneBy({ id: sector_id });
    if (!sector) {
      return null;
    }
    Object.assign(sector, sector_set);
    return this.entity.save(sector);
  }

  async getBy<K extends keyof Sector>(search_value: Sector[K], search_by: K): Promise<Sector | null> {
    const sectorFound = await this.entity.findOne({
      where: { [search_by]: search_value },
      relations: { church: true }
    });
    return sectorFound
  }
}
