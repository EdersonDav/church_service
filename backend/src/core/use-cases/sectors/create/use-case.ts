import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { SectorRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class CreateSector {
  constructor(
    private sectorService: SectorRepository,
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.sectorService.save(input)
    return {
      data: {
        name: data.name,
        id: data.id
      }
    }
  }
}
