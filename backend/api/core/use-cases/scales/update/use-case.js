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
exports.UpdateScale = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../../../database/repositories/interfaces");
let UpdateScale = class UpdateScale {
    constructor(scaleRepository) {
        this.scaleRepository = scaleRepository;
    }
    async execute({ scale_id, sector_id, date }) {
        const scale = await this.scaleRepository.findById(scale_id);
        if (!scale || scale.sector_id !== sector_id) {
            throw new common_1.NotFoundException('Scale not found');
        }
        if (!date) {
            return { data: scale };
        }
        const conflict = await this.scaleRepository.findBySectorAndDate(sector_id, date);
        if (conflict && conflict.id !== scale_id) {
            throw new common_1.BadRequestException('A scale already exists for this date');
        }
        const updated = await this.scaleRepository.update(scale_id, { date });
        if (!updated) {
            throw new common_1.NotFoundException('Scale not found');
        }
        return { data: updated };
    }
};
exports.UpdateScale = UpdateScale;
exports.UpdateScale = UpdateScale = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.ScaleRepository])
], UpdateScale);
//# sourceMappingURL=use-case.js.map