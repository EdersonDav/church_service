import { Injectable } from '@nestjs/common';
import { ScaleRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class GetScale {
    constructor(
        private readonly scaleRepository: ScaleRepository,
    ) { }

    async execute({ scale_id }: Input): Promise<Output> {
        const data = await this.scaleRepository.findById(scale_id);
        return { data };
    }
}
