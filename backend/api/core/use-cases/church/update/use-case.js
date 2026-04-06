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
exports.UpdateChurch = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../../../database/repositories/interfaces");
const helpers_1 = require("../../../helpers");
let UpdateChurch = class UpdateChurch {
    constructor(churchRepository) {
        this.churchRepository = churchRepository;
    }
    async execute({ church_id, church_data }) {
        const data = await this.churchRepository.update(church_id, (0, helpers_1.removeNullUndefinedFields)(church_data));
        if (!data) {
            throw new Error('Error updating church');
        }
        return {
            data
        };
    }
};
exports.UpdateChurch = UpdateChurch;
exports.UpdateChurch = UpdateChurch = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.ChurchRepository])
], UpdateChurch);
//# sourceMappingURL=use-case.js.map