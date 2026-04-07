import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { SectorRepository } from '../../../../database/repositories/interfaces';
import { Output } from './output';

@Injectable()
export class GetSector {
  constructor(
    private sectorRepository: SectorRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.sectorRepository.getBy(input.search_data, input.search_by);
    return { data };
  }
}
