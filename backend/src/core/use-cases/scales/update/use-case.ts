import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ScaleRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class UpdateScale {
    constructor(
        private readonly scaleRepository: ScaleRepository,
    ) { }

    async execute({ scale_id, sector_id, date }: Input): Promise<Output> {
        const scale = await this.scaleRepository.findById(scale_id);

        if (!scale || scale.sector_id !== sector_id) {
            throw new NotFoundException('Scale not found');
        }

        if (!date) {
            return { data: scale };
        }

        const conflict = await this.scaleRepository.findBySectorAndDate(sector_id, date);

        if (conflict && conflict.id !== scale_id) {
            throw new BadRequestException('A scale already exists for this date');
        }

        const updated = await this.scaleRepository.update(scale_id, { date });

        if (!updated) {
            throw new NotFoundException('Scale not found');
        }

        return { data: updated };
    }
}
