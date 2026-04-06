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
exports.GetChurchUserResponse = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("../../common");
const enums_1 = require("../../../../../enums");
class GetChurchUserResponse {
}
exports.GetChurchUserResponse = GetChurchUserResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the church user' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetChurchUserResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp when the church user was created' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GetChurchUserResponse.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp when the church user was last updated' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GetChurchUserResponse.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role of the user in the church' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetChurchUserResponse.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the user' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetChurchUserResponse.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the church' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetChurchUserResponse.prototype, "church_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User information' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => common_1.ResponseUserDTO),
    __metadata("design:type", common_1.ResponseUserDTO)
], GetChurchUserResponse.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Church information' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => common_1.ResponseChurchDTO),
    __metadata("design:type", common_1.ResponseChurchDTO)
], GetChurchUserResponse.prototype, "church", void 0);
//# sourceMappingURL=response.js.map