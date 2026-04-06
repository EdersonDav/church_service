"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetScaleParticipants = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../../../database/repositories/interfaces");
const scale_songs_1 = require("../../scale-songs");
let SetScaleParticipants = class SetScaleParticipants {
    constructor(scaleRepository, participantRepository, taskRepository, userSectorRepository, unavailabilityRepository, recalculateScaleSongKeys) {
        this.scaleRepository = scaleRepository;
        this.participantRepository = participantRepository;
        this.taskRepository = taskRepository;
        this.userSectorRepository = userSectorRepository;
        this.unavailabilityRepository = unavailabilityRepository;
        this.recalculateScaleSongKeys = recalculateScaleSongKeys;
    }
    async execute({ scale_id, sector_id, participants }) {
        const scale = await this.scaleRepository.findById(scale_id);
        if (!scale || scale.sector_id !== sector_id) {
            throw new common_1.NotFoundException('Scale not found');
        }
        const uniqueParticipantsMap = new Map();
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
            throw new common_1.NotFoundException('One or more tasks were not found');
        }
        for (const task of tasks) {
            if (task.sector_id !== sector_id) {
                throw new common_1.BadRequestException('Task does not belong to this sector');
            }
        }
        for (const participant of uniqueParticipants) {
            const membership = await this.userSectorRepository.getByUserAndSector(participant.user_id, sector_id);
            if (!membership) {
                throw new common_1.BadRequestException('User is not a member of this sector');
            }
            const hasUnavailability = await this.unavailabilityRepository.findByUserAndDate(participant.user_id, scale.date);
            if (hasUnavailability) {
                throw new common_1.BadRequestException('User is unavailable on this date');
            }
            const otherSchedules = await this.participantRepository.findByUserAndDate(participant.user_id, scale.date);
            const conflict = otherSchedules.find((item) => item.scale_id !== scale_id);
            if (conflict) {
                const sectorName = conflict.scale?.sector?.name ?? 'another sector';
                throw new common_1.BadRequestException(`This user is already scheduled in sector ${sectorName}`);
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
        const ordered = uniqueParticipants.length
            ? uniqueParticipants
                .map((item) => updated.find((participant) => participant.user_id === item.user_id && participant.task_id === item.task_id))
                .filter((participant) => !!participant)
            : updated;
        await this.recalculateScaleSongKeys.execute({ scale_id: scale_id });
        return { data: ordered };
    }
};
exports.SetScaleParticipants = SetScaleParticipants;
exports.SetScaleParticipants = SetScaleParticipants = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.ScaleRepository,
        interfaces_1.ParticipantRepository,
        interfaces_1.TaskRepository,
        interfaces_1.UserSectorRepository,
        interfaces_1.UnavailabilityRepository,
        scale_songs_1.RecalculateScaleSongKeys])
], SetScaleParticipants);
//# sourceMappingURL=use-case.js.map