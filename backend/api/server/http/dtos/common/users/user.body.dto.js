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
exports.BodyUserDTO = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class BodyUserDTO {
}
exports.BodyUserDTO = BodyUserDTO;
__decorate([
    (0, class_validator_1.IsString)({ message: 'The name is needed' }),
    (0, class_validator_1.Length)(3, 25, { message: 'The name must be between 3 and 25 characters' }),
    __metadata("design:type", String)
], BodyUserDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'The password is needed' }),
    (0, class_validator_1.Length)(8, 100, { message: 'The password must be between 8 and 100 characters' }),
    (0, class_validator_1.IsStrongPassword)({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }, {
        message: "Password must be strong and contain at least 8 characters, including at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol."
    }),
    __metadata("design:type", String)
], BodyUserDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, {
        message: "Email must be a valid email address."
    }),
    (0, class_validator_1.IsString)({ message: 'The email is needed' }),
    (0, class_validator_1.Length)(3, 100, { message: 'The email must be between 3 and 100 characters' }),
    __metadata("design:type", String)
], BodyUserDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? new Date(value) : null),
    (0, class_validator_1.IsDate)({ message: 'The birthday is needed to format as YYYY-MM-DD' }),
    __metadata("design:type", Object)
], BodyUserDTO.prototype, "birthday", void 0);
//# sourceMappingURL=user.body.dto.js.map