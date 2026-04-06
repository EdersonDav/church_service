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
exports.ResponseChurchDTO = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ResponseChurchDTO {
}
exports.ResponseChurchDTO = ResponseChurchDTO;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f', description: 'Church ID' }),
    __metadata("design:type", String)
], ResponseChurchDTO.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'The last church', description: 'Church Name' }),
    __metadata("design:type", String)
], ResponseChurchDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User Created At' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ResponseChurchDTO.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User Updated At' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ResponseChurchDTO.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Church Description' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResponseChurchDTO.prototype, "description", void 0);
//# sourceMappingURL=church.response.dto.js.map