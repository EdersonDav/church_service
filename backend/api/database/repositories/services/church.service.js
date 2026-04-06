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
exports.ChurchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let ChurchService = class ChurchService {
    constructor(entity) {
        this.entity = entity;
    }
    async save(church) {
        const churchCreated = this.entity.create(church);
        const savedChurch = await this.entity.save(churchCreated);
        return savedChurch;
    }
    async delete(id) {
        await this.entity.delete(id);
    }
    async update(church_id, church_set) {
        const church = await this.entity.findOneBy({ id: church_id });
        if (!church) {
            return null;
        }
        Object.assign(church, church_set);
        return this.entity.save(church);
    }
    async getBy(search_value, search_by) {
        const churchFound = await this.entity.findOne({ where: { [search_by]: search_value } });
        return churchFound;
    }
    async list() {
        return this.entity.find({
            order: {
                name: 'ASC',
            },
        });
    }
};
exports.ChurchService = ChurchService;
exports.ChurchService = ChurchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Church)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChurchService);
//# sourceMappingURL=church.service.js.map