import { Injectable } from '@nestjs/common';
import { ScaleRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';

@Injectable()
export class DeleteScale {
    constructor(
        private readonly scaleRepository: ScaleRepository,
    ) { }

    async execute({ scale_id }: Input): Promise<void> {
        await this.scaleRepository.delete(scale_id);
    }
}
