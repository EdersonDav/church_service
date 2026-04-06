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
exports.SetMySongKeysBody = exports.MinisterSongKeyItemBody = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class MinisterSongKeyItemBody {
}
exports.MinisterSongKeyItemBody = MinisterSongKeyItemBody;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f971f727-8861-4d37-b37f-9c48f6172e2f' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MinisterSongKeyItemBody.prototype, "song_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 10),
    __metadata("design:type", String)
], MinisterSongKeyItemBody.prototype, "custom_key", void 0);
class SetMySongKeysBody {
}
exports.SetMySongKeysBody = SetMySongKeysBody;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MinisterSongKeyItemBody] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MinisterSongKeyItemBody),
    __metadata("design:type", Array)
], SetMySongKeysBody.prototype, "items", void 0);
//# sourceMappingURL=body.js.map