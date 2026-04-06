"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationCodeModule = void 0;
const common_1 = require("@nestjs/common");
const create_1 = require("./create");
const verify_1 = require("./verify");
const delete_code_1 = require("./delete-code");
const database_1 = require("../../../database");
const verificationCodeUseCases = [
    create_1.CreateVerificationCode,
    verify_1.VerifyCode,
    delete_code_1.DeleteCode,
];
let VerificationCodeModule = class VerificationCodeModule {
};
exports.VerificationCodeModule = VerificationCodeModule;
exports.VerificationCodeModule = VerificationCodeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_1.DataBaseModule
        ],
        providers: verificationCodeUseCases,
        exports: verificationCodeUseCases,
    })
], VerificationCodeModule);
//# sourceMappingURL=verification-code.module.js.map