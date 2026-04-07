import { Injectable } from '@nestjs/common';
import { ScaleRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class ListScalesBySector {
    constructor(
        private readonly scaleRepository: ScaleRepository,
    ) { }

    async execute({ sector_id }: Input): Promise<Output> {
        const data = await this.scaleRepository.findBySector(sector_id);
        return { data };
    }
}
