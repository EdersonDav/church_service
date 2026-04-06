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
exports.UpdateExtraEventBody = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateExtraEventBody {
}
exports.UpdateExtraEventBody = UpdateExtraEventBody;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Conferência de Casais', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 100),
    __metadata("design:type", String)
], UpdateExtraEventBody.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Evento anual da igreja', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateExtraEventBody.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'COUPLE_SERVICE', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 50),
    __metadata("design:type", String)
], UpdateExtraEventBody.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-09-12T19:00:00.000Z', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)({}, { message: 'Invalid date format. Use ISO 8601.' }),
    __metadata("design:type", String)
], UpdateExtraEventBody.prototype, "date", void 0);
//# sourceMappingURL=body.js.map