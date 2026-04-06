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
exports.ResponseUserDTO = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ResponseUserDTO {
}
exports.ResponseUserDTO = ResponseUserDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResponseUserDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User Email' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResponseUserDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User Name' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResponseUserDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User Birthday' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ResponseUserDTO.prototype, "birthday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User Is Verified' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ResponseUserDTO.prototype, "is_verified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User Created At' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ResponseUserDTO.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User Updated At' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ResponseUserDTO.prototype, "updated_at", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], ResponseUserDTO.prototype, "password", void 0);
//# sourceMappingURL=user.response.dto.js.map