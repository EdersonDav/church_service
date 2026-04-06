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
exports.TaskDto = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class TaskDto {
}
exports.TaskDto = TaskDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23', description: 'Task identifier' }),
    __metadata("design:type", String)
], TaskDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Minister', description: 'Task name' }),
    __metadata("design:type", String)
], TaskDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/icon.png', description: 'Icon image url', required: false }),
    __metadata("design:type", String)
], TaskDto.prototype, "icon", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Responsible for leading worship', description: 'Task description', required: false }),
    __metadata("design:type", String)
], TaskDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5', description: 'Sector identifier' }),
    __metadata("design:type", String)
], TaskDto.prototype, "sector_id", void 0);
//# sourceMappingURL=task.dto.js.map