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
exports.CreateUnavailability = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../../../database/repositories/interfaces");
let CreateUnavailability = class CreateUnavailability {
    constructor(unavailabilityRepository, participantRepository) {
        this.unavailabilityRepository = unavailabilityRepository;
        this.participantRepository = participantRepository;
    }
    async execute({ user_id, date }) {
        const scheduled = await this.participantRepository.findByUserAndDate(user_id, date);
        if (scheduled.length) {
            const sectorName = scheduled[0]?.scale?.sector?.name;
            const suffix = sectorName ? ` in sector ${sectorName}` : '';
            throw new common_1.BadRequestException(`User is already scheduled${suffix} on this date`);
        }
        const existing = await this.unavailabilityRepository.findByUserAndDate(user_id, date);
        if (existing) {
            throw new common_1.BadRequestException('User already unavailable for this date');
        }
        const data = await this.unavailabilityRepository.save({ user_id, date });
        return { data };
    }
};
exports.CreateUnavailability = CreateUnavailability;
exports.CreateUnavailability = CreateUnavailability = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.UnavailabilityRepository,
        interfaces_1.ParticipantRepository])
], CreateUnavailability);
//# sourceMappingURL=use-case.js.map