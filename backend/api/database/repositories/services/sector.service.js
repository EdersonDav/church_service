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
exports.SectorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let SectorService = class SectorService {
    constructor(entity) {
        this.entity = entity;
        this.onConflictConfig = {
            conflictPaths: ['name', 'church_id'],
            skipUpdateIfNoValuesChanged: true,
            upsertType: 'on-conflict-do-update',
        };
    }
    async save(sector) {
        const alreadyExistsInThisChurch = await this.entity.findOneBy({ name: sector.name, church_id: sector.church_id });
        if (alreadyExistsInThisChurch) {
            return alreadyExistsInThisChurch;
        }
        const sectorCreated = this.entity.create(sector);
        await this.entity.save(sectorCreated);
        return sectorCreated;
    }
    async delete(id) {
        await this.entity.delete(id);
    }
    async update(sector_id, sector_set) {
        const sector = await this.entity.findOneBy({ id: sector_id });
        if (!sector) {
            return null;
        }
        Object.assign(sector, sector_set);
        return this.entity.save(sector);
    }
    async getBy(search_value, search_by) {
        const sectorFound = await this.entity.findOne({
            where: { [search_by]: search_value },
            relations: { church: true }
        });
        return sectorFound;
    }
    async listByChurch(church_id) {
        return this.entity.find({
            where: { church_id },
            order: { name: 'ASC' },
        });
    }
};
exports.SectorService = SectorService;
exports.SectorService = SectorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Sector)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SectorService);
//# sourceMappingURL=sector.service.js.map