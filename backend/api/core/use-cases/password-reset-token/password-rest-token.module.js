"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetTokenModule = void 0;
const common_1 = require("@nestjs/common");
const create_1 = require("./create");
const verify_1 = require("./verify");
const delete_token_1 = require("./delete-token");
const database_1 = require("../../../database");
const passwordResetTokenUseCases = [
    create_1.CreatePasswordResetToken,
    verify_1.VerifyToken,
    delete_token_1.DeleteToken
];
let PasswordResetTokenModule = class PasswordResetTokenModule {
};
exports.PasswordResetTokenModule = PasswordResetTokenModule;
exports.PasswordResetTokenModule = PasswordResetTokenModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_1.DataBaseModule
        ],
        providers: passwordResetTokenUseCases,
        exports: passwordResetTokenUseCases,
    })
], PasswordResetTokenModule);
//# sourceMappingURL=password-rest-token.module.js.map