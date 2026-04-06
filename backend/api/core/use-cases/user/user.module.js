"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const create_1 = require("./create");
const delete_1 = require("./delete");
const update_1 = require("./update");
const update_password_1 = require("./update-password");
const get_no_verified_1 = require("./get-no-verified");
const get_1 = require("./get");
const database_1 = require("../../../database");
const mark_as_verify_1 = require("./mark-as-verify");
const useCases = [
    create_1.CreateUser,
    update_1.UpdateUser,
    get_no_verified_1.GetNotVerifiedUser,
    delete_1.DeleteUser,
    get_1.GetUser,
    mark_as_verify_1.MarkAsVerifiedUser,
    update_password_1.UpdatePasswordUser
];
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_1.DataBaseModule,
        ],
        providers: useCases,
        exports: useCases,
    })
], UserModule);
//# sourceMappingURL=user.module.js.map