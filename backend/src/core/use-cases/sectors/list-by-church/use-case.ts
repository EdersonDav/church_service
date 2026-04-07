import { Injectable } from '@nestjs/common';
import { SectorRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class ListSectorsByChurch {
    constructor(
        private readonly sectorRepository: SectorRepository
    ) { }

    async execute({ church_id }: Input): Promise<Output> {
        const data = await this.sectorRepository.listByChurch(church_id);
        return { data };
    }
}
