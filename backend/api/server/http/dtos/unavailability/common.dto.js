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
exports.UnavailabilityDto = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class UnavailabilityDto {
}
exports.UnavailabilityDto = UnavailabilityDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'd51c7c49-03f1-4243-9b27-77c7c3d3dfd5', description: 'Unavailability identifier' }),
    __metadata("design:type", String)
], UnavailabilityDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: '2024-07-01T00:00:00.000Z', description: 'Date in ISO format' }),
    (0, class_transformer_1.Transform)(({ value }) => value instanceof Date ? value.toISOString() : value),
    __metadata("design:type", String)
], UnavailabilityDto.prototype, "date", void 0);
//# sourceMappingURL=common.dto.js.map