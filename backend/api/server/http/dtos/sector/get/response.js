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
exports.GetSectorUserResponse = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("../../common");
const enums_1 = require("../../../../../enums");
class GetSectorUserResponse {
}
exports.GetSectorUserResponse = GetSectorUserResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the sector user' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetSectorUserResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp when the sector user was created' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GetSectorUserResponse.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp when the sector user was last updated' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GetSectorUserResponse.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role of the user in the sector' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetSectorUserResponse.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the user' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetSectorUserResponse.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the sector' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetSectorUserResponse.prototype, "sector_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User information' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => common_1.ResponseUserDTO),
    __metadata("design:type", common_1.ResponseUserDTO)
], GetSectorUserResponse.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sector information' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => common_1.ResponseSectorDTO),
    __metadata("design:type", common_1.ResponseSectorDTO)
], GetSectorUserResponse.prototype, "sector", void 0);
//# sourceMappingURL=response.js.map