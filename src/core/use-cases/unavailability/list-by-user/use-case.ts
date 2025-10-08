import { Injectable } from '@nestjs/common';
import { UnavailabilityRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class ListUserUnavailability {
    constructor(
        private readonly unavailabilityRepository: UnavailabilityRepository,
    ) { }

    async execute({ user_id }: Input): Promise<Output> {
        const data = await this.unavailabilityRepository.listByUser(user_id);
        return { data };
    }
}
