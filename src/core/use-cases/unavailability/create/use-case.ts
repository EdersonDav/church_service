import { BadRequestException, Injectable } from '@nestjs/common';
import { UnavailabilityRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class CreateUnavailability {
    constructor(
        private readonly unavailabilityRepository: UnavailabilityRepository,
    ) { }

    async execute({ user_id, date }: Input): Promise<Output> {
        const existing = await this.unavailabilityRepository.findByUserAndDate(user_id, date);

        if (existing) {
            throw new BadRequestException('User already unavailable for this date');
        }

        const data = await this.unavailabilityRepository.save({ user_id, date });
        return { data };
    }
}
