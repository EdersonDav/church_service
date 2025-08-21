import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { SectorRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class DeleteSector {
  constructor(
    private sectorService: SectorRepository
  ) { }
  async execute(input: Input): Promise<void> {
    await this.sectorService.delete(input.sector_id);
  }
}
