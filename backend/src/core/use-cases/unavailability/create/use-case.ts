import { BadRequestException, Injectable } from '@nestjs/common';
import {
    ParticipantRepository,
    UnavailabilityRepository
} from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class CreateUnavailability {
    constructor(
        private readonly unavailabilityRepository: UnavailabilityRepository,
        private readonly participantRepository: ParticipantRepository,
    ) { }

    async execute({ user_id, date, end_date }: Input): Promise<Output> {
        const endDate = end_date ?? date;

        if (endDate.getTime() < date.getTime()) {
            throw new BadRequestException('End date must be after start date');
        }

        const scheduled = await this.participantRepository.findByUserAndRange(user_id, date, endDate);

        if (scheduled.length) {
            const sectorName = scheduled[0]?.scale?.sector?.name;
            const suffix = sectorName ? ` in sector ${sectorName}` : '';

            throw new BadRequestException(`User is already scheduled${suffix} on this date`);
        }

        const existing = await this.unavailabilityRepository.findByUserAndDate(user_id, date);

        if (existing) {
            throw new BadRequestException('User already unavailable for this date');
        }

        const data = await this.unavailabilityRepository.save({ user_id, date, end_date: endDate });
        return { data };
    }
}
