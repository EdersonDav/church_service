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
exports.ScaleParticipantDto = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ScaleParticipantDto {
}
exports.ScaleParticipantDto = ScaleParticipantDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'f61c1fb0-316c-4a7a-a3b0-1bd19d8da3da', description: 'User identifier' }),
    __metadata("design:type", String)
], ScaleParticipantDto.prototype, "user_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: '2bf6c88b-1b0e-4a9f-b5f7-68bb5f4f5e39', description: 'Task identifier' }),
    __metadata("design:type", String)
], ScaleParticipantDto.prototype, "task_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Minister', required: false }),
    __metadata("design:type", String)
], ScaleParticipantDto.prototype, "task_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Jane Doe', required: false }),
    __metadata("design:type", String)
], ScaleParticipantDto.prototype, "user_name", void 0);
//# sourceMappingURL=participant.dto.js.map