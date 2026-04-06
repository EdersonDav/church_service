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
exports.ScaleDto = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const participant_dto_1 = require("./participant.dto");
class ScaleDto {
}
exports.ScaleDto = ScaleDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: '0e91d1cd-a808-4ef3-9618-1f049d9fe76d', description: 'Scale identifier' }),
    __metadata("design:type", String)
], ScaleDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: '2024-06-21T18:00:00.000Z', description: 'Scheduled date in ISO format' }),
    (0, class_transformer_1.Transform)(({ value }) => value instanceof Date ? value.toISOString() : value),
    __metadata("design:type", String)
], ScaleDto.prototype, "date", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: '5a971fe8-d468-44df-a582-4adb44d6fda0', description: 'Sector identifier' }),
    __metadata("design:type", String)
], ScaleDto.prototype, "sector_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => participant_dto_1.ScaleParticipantDto),
    (0, swagger_1.ApiProperty)({ type: participant_dto_1.ScaleParticipantDto, isArray: true }),
    __metadata("design:type", Array)
], ScaleDto.prototype, "participants", void 0);
//# sourceMappingURL=scale.dto.js.map