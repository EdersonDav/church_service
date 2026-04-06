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
exports.ScaleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let ScaleService = class ScaleService {
    constructor(entity) {
        this.entity = entity;
    }
    async save(scale) {
        const created = this.entity.create(scale);
        return this.entity.save(created);
    }
    async delete(id) {
        await this.entity.delete(id);
    }
    async findById(scale_id) {
        return this.entity.findOne({
            where: { id: scale_id },
            relations: {
                sector: true,
                participants: {
                    user: true,
                    task: true,
                },
            },
        });
    }
    async findBySector(sector_id) {
        return this.entity.find({
            where: { sector_id },
            relations: {
                participants: {
                    user: true,
                    task: true,
                },
            },
            order: {
                date: 'ASC',
            },
        });
    }
    async findBySectorAndDate(sector_id, date) {
        return this.entity.findOne({
            where: { sector_id, date },
        });
    }
    async update(scale_id, data) {
        const scale = await this.entity.findOne({ where: { id: scale_id } });
        if (!scale) {
            return null;
        }
        Object.assign(scale, data);
        return this.entity.save(scale);
    }
};
exports.ScaleService = ScaleService;
exports.ScaleService = ScaleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Scale)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ScaleService);
//# sourceMappingURL=scale.service.js.map