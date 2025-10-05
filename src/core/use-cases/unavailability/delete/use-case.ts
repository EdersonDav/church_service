import { Injectable } from '@nestjs/common';
import { UnavailabilityRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';

@Injectable()
export class DeleteUnavailability {
    constructor(
        private readonly unavailabilityRepository: UnavailabilityRepository,
    ) { }

    async execute({ unavailability_id }: Input): Promise<void> {
        await this.unavailabilityRepository.delete(unavailability_id);
    }
}
