import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { SectorRepository } from '../../../../database/repositories/interfaces';
import { removeNullUndefinedFields } from '../../../helpers';

@Injectable()
export class UpdateSector {
  constructor(
    private sectorRepository: SectorRepository
  ) { }
  async execute({ sector_id, sector_data }: Input): Promise<Output> {
    const data = await this.sectorRepository.update(sector_id, removeNullUndefinedFields(sector_data));
    if (!data) {
      throw new Error('Error updating sector');
    }

    return {
      data
    }
  }
}
