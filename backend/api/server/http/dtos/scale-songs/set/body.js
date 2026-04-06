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
exports.SetScaleSongsBody = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SetScaleSongsBody {
}
exports.SetScaleSongsBody = SetScaleSongsBody;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: [
            'f971f727-8861-4d37-b37f-9c48f6172e2f',
            '79271a79-f7cd-47cc-a250-f2f2f0377cfd',
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    __metadata("design:type", Array)
], SetScaleSongsBody.prototype, "song_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: '6d377d4a-1665-4f0f-a021-f655a0e050af',
        description: 'Seleciona explicitamente o ministro para aplicar tons personalizados',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SetScaleSongsBody.prototype, "minister_id", void 0);
//# sourceMappingURL=body.js.map