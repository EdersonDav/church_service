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
exports.MinisterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let MinisterService = class MinisterService {
    constructor(entity) {
        this.entity = entity;
    }
    async save(minister_data) {
        const minister = this.entity.create(minister_data);
        return this.entity.save(minister);
    }
    async delete(id) {
        await this.entity.delete(id);
    }
    async getById(minister_id) {
        return this.entity.findOne({
            where: { id: minister_id },
            relations: {
                user: true,
                church: true,
            },
        });
    }
    async getByUserAndChurch(user_id, church_id) {
        return this.entity.findOne({
            where: {
                user_id,
                church_id,
            },
            relations: {
                user: true,
                church: true,
            },
        });
    }
    async listByChurch(church_id) {
        return this.entity.find({
            where: { church_id },
            relations: {
                user: true,
            },
            order: {
                name: 'ASC',
            },
        });
    }
    async findByChurchAndUsers(church_id, user_ids) {
        if (!user_ids.length) {
            return [];
        }
        return this.entity.find({
            where: {
                church_id,
                user_id: (0, typeorm_2.In)(user_ids),
            },
            relations: {
                user: true,
            },
        });
    }
};
exports.MinisterService = MinisterService;
exports.MinisterService = MinisterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Minister)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MinisterService);
//# sourceMappingURL=minister.service.js.map