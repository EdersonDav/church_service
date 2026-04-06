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
exports.ScaleSongDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class ScaleSongDto {
}
exports.ScaleSongDto = ScaleSongDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: '4ceb96d4-bf23-4d11-a34e-f314158b9fd5' }),
    __metadata("design:type", String)
], ScaleSongDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'f971f727-8861-4d37-b37f-9c48f6172e2f' }),
    __metadata("design:type", String)
], ScaleSongDto.prototype, "song_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Alvo Mais Que a Neve' }),
    __metadata("design:type", String)
], ScaleSongDto.prototype, "song_title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'G' }),
    __metadata("design:type", String)
], ScaleSongDto.prototype, "song_default_key", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'A' }),
    __metadata("design:type", String)
], ScaleSongDto.prototype, "key", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: '6d377d4a-1665-4f0f-a021-f655a0e050af', nullable: true }),
    __metadata("design:type", Object)
], ScaleSongDto.prototype, "minister_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Jane Doe', nullable: true }),
    __metadata("design:type", Object)
], ScaleSongDto.prototype, "minister_name", void 0);
//# sourceMappingURL=scale-song.dto.js.map