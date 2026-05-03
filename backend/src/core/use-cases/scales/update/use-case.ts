import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ScaleRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class UpdateScale {
    constructor(
        private readonly scaleRepository: ScaleRepository,
    ) { }

    async execute({ scale_id, sector_id, title, description, status, date }: Input): Promise<Output> {
        const scale = await this.scaleRepository.findById(scale_id);

        if (!scale || scale.sector_id !== sector_id) {
            throw new NotFoundException('Scale not found');
        }

        if (!date && !title && description === undefined && status === undefined) {
            return { data: scale };
        }

        const conflict = date
            ? await this.scaleRepository.findBySectorAndDate(sector_id, date)
            : null;

        if (conflict && conflict.id !== scale_id) {
            throw new BadRequestException('A scale already exists for this date');
        }

        const updated = await this.scaleRepository.update(scale_id, {
            ...(date ? { date } : {}),
            ...(title ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(status !== undefined ? { status } : {}),
        });

        if (!updated) {
            throw new NotFoundException('Scale not found');
        }

        return { data: updated };
    }
}
