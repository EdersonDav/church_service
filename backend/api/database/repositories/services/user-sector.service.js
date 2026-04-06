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
exports.UserSectorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let UserSectorService = class UserSectorService {
    constructor(entity) {
        this.entity = entity;
    }
    async getByUserAndSector(user_id, sector_id) {
        return await this.entity.findOne({
            where: {
                user_id,
                sector_id
            },
            relations: {
                sector: true,
                user: true
            }
        });
    }
    async save(userSector) {
        const userSectorCreated = this.entity.create(userSector);
        await this.entity.upsert(userSectorCreated, {
            conflictPaths: ['user_id', 'sector_id'],
            skipUpdateIfNoValuesChanged: true,
            upsertType: 'on-conflict-do-update'
        });
        return userSectorCreated;
    }
    async delete(id) {
        await this.entity.delete(id);
    }
    async deleteByUserAndSector(user_id, sector_id) {
        await this.entity.delete({
            user_id,
            sector_id,
        });
    }
    async deleteByUserAndChurch(user_id, church_id) {
        const relations = await this.entity.find({
            where: { user_id },
            relations: { sector: true },
        });
        const idsToDelete = relations
            .filter((relation) => relation.sector?.church_id === church_id)
            .map((relation) => relation.id);
        if (!idsToDelete.length) {
            return;
        }
        await this.entity.delete(idsToDelete);
    }
    async getSectorMembers(sector_id) {
        const members = await this.entity.find({
            where: {
                sector_id
            },
            relations: {
                user: true,
                sector: true
            }
        });
        return {
            sector: members[0]?.sector,
            members: members.map(member => member.user)
        };
    }
};
exports.UserSectorService = UserSectorService;
exports.UserSectorService = UserSectorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.UserSector)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserSectorService);
//# sourceMappingURL=user-sector.service.js.map