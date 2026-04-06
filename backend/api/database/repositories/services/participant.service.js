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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let ParticipantService = class ParticipantService {
    constructor(entity) {
        this.entity = entity;
    }
    async save(participant) {
        const created = this.entity.create(participant);
        return this.entity.save(created);
    }
    async delete(id) {
        await this.entity.delete(id);
    }
    async findByScale(scale_id) {
        return this.entity.find({
            where: { scale_id },
            relations: {
                task: true,
                user: true,
                scale: true,
            },
        });
    }
    async findByUserAndDate(user_id, date) {
        const dateOnly = this.toDateOnly(date);
        return this.entity
            .createQueryBuilder('participant')
            .innerJoinAndSelect('participant.scale', 'scale')
            .leftJoinAndSelect('scale.sector', 'sector')
            .leftJoinAndSelect('participant.task', 'task')
            .leftJoinAndSelect('participant.user', 'user')
            .where('participant.user_id = :user_id', { user_id })
            .andWhere('DATE(scale.date) = :dateOnly', { dateOnly })
            .getMany();
    }
    toDateOnly(date) {
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }
        return date.toISOString().slice(0, 10);
    }
};
exports.ParticipantService = ParticipantService;
exports.ParticipantService = ParticipantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Participant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ParticipantService);
//# sourceMappingURL=participant.service.js.map