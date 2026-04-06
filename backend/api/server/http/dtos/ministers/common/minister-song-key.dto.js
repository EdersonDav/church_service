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
exports.MinisterSongKeyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class MinisterSongKeyDto {
}
exports.MinisterSongKeyDto = MinisterSongKeyDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'f971f727-8861-4d37-b37f-9c48f6172e2f' }),
    __metadata("design:type", String)
], MinisterSongKeyDto.prototype, "song_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Alvo Mais Que a Neve' }),
    __metadata("design:type", String)
], MinisterSongKeyDto.prototype, "song_title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'G' }),
    __metadata("design:type", String)
], MinisterSongKeyDto.prototype, "song_default_key", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'A' }),
    __metadata("design:type", String)
], MinisterSongKeyDto.prototype, "custom_key", void 0);
//# sourceMappingURL=minister-song-key.dto.js.map