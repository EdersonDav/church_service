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
exports.UserChurchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let UserChurchService = class UserChurchService {
    constructor(entity) {
        this.entity = entity;
    }
    async getByUserAndChurch(user_id, church_id) {
        return await this.entity.findOne({
            where: {
                user_id,
                church_id
            },
            relations: {
                church: true,
                user: true
            }
        });
    }
    async save(userChurch) {
        const userChurchCreated = this.entity.create(userChurch);
        await this.entity.upsert(userChurchCreated, {
            conflictPaths: ['user_id', 'church_id'],
            skipUpdateIfNoValuesChanged: true,
            upsertType: 'on-conflict-do-update'
        });
        return userChurchCreated;
    }
    async delete(id) {
        await this.entity.delete(id);
    }
    async deleteByUserAndChurch(user_id, church_id) {
        await this.entity.delete({
            user_id,
            church_id,
        });
    }
    async getChurchMembers(church_id) {
        const members = await this.entity.find({
            where: {
                church_id
            },
            relations: {
                user: true,
                church: true
            }
        });
        return {
            church: members[0]?.church,
            members: members.map(member => member.user)
        };
    }
};
exports.UserChurchService = UserChurchService;
exports.UserChurchService = UserChurchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.UserChurch)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserChurchService);
//# sourceMappingURL=user-church.service.js.map