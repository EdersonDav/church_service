import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
    ParticipantRepository,
    ScaleRepository,
    TaskRepository,
    UnavailabilityRepository,
    UserSectorRepository
} from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class SetScaleParticipants {
    constructor(
        private readonly scaleRepository: ScaleRepository,
        private readonly participantRepository: ParticipantRepository,
        private readonly taskRepository: TaskRepository,
        private readonly userSectorRepository: UserSectorRepository,
        private readonly unavailabilityRepository: UnavailabilityRepository,
    ) { }

    async execute({ scale_id, sector_id, participants }: Input): Promise<Output> {
        const scale = await this.scaleRepository.findById(scale_id);

        if (!scale || scale.sector_id !== sector_id) {
            throw new NotFoundException('Scale not found');
        }

        const uniqueParticipantsMap = new Map<string, { user_id: string; task_id: string }>();
        for (const participant of participants) {
            const key = `${participant.user_id}:${participant.task_id}`;
            if (!uniqueParticipantsMap.has(key)) {
                uniqueParticipantsMap.set(key, participant);
            }
        }

        const uniqueParticipants = Array.from(uniqueParticipantsMap.values());

        const taskIds = Array.from(new Set(uniqueParticipants.map((item) => item.task_id)));
        const tasks = await this.taskRepository.findByIds(taskIds);

        if (tasks.length !== taskIds.length) {
            throw new NotFoundException('One or more tasks were not found');
        }

        for (const task of tasks) {
            if (task.sector_id !== sector_id) {
                throw new BadRequestException('Task does not belong to this sector');
            }
        }

        for (const participant of uniqueParticipants) {
            const membership = await this.userSectorRepository.getByUserAndSector(participant.user_id, sector_id);

            if (!membership) {
                throw new BadRequestException('User is not a member of this sector');
            }

            const hasUnavailability = await this.unavailabilityRepository.findByUserAndDate(participant.user_id, scale.date);

            if (hasUnavailability) {
                throw new BadRequestException('User is unavailable on this date');
            }

            const otherSchedules = await this.participantRepository.findByUserAndDate(participant.user_id, scale.date);

            const conflict = otherSchedules.find((item) => item.scale_id !== scale_id);

            if (conflict) {
                const sectorName = conflict.scale?.sector?.name ?? 'another sector';
                throw new BadRequestException(`This user is already scheduled in sector ${sectorName}`);
            }
        }

        const currentParticipants = await this.participantRepository.findByScale(scale_id);
        const desiredKeys = new Set(uniqueParticipants.map((item) => `${item.user_id}:${item.task_id}`));

        const removals = currentParticipants.filter((participant) => !desiredKeys.has(`${participant.user_id}:${participant.task_id}`));
        await Promise.all(removals.map((participant) => this.participantRepository.delete(participant.id)));

        const currentKeys = new Set(currentParticipants.map((participant) => `${participant.user_id}:${participant.task_id}`));
        const creations = uniqueParticipants.filter((item) => !currentKeys.has(`${item.user_id}:${item.task_id}`));

        await Promise.all(creations.map((participant) => this.participantRepository.save({
            scale_id,
            user_id: participant.user_id,
            task_id: participant.task_id,
        })));

        const updated = await this.participantRepository.findByScale(scale_id);

        // Ensure returned participants follow the requested order when possible
        const ordered = uniqueParticipants.length
            ? uniqueParticipants
                .map((item) => updated.find((participant) => participant.user_id === item.user_id && participant.task_id === item.task_id))
                .filter((participant): participant is NonNullable<typeof participant> => !!participant)
            : updated;

        return { data: ordered };
    }
}
