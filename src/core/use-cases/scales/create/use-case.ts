import { BadRequestException, Injectable } from '@nestjs/common';
import { ScaleRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class CreateScale {
    constructor(
        private readonly scaleRepository: ScaleRepository,
    ) { }

    async execute({ sector_id, date }: Input): Promise<Output> {
        const existingScale = await this.scaleRepository.findBySectorAndDate(sector_id, date);

        if (existingScale) {
            throw new BadRequestException('A scale already exists for this date');
        }

        const data = await this.scaleRepository.save({ sector_id, date });
        return { data };
    }
}
