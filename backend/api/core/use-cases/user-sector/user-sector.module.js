"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSectorModule = void 0;
const common_1 = require("@nestjs/common");
const create_1 = require("./create");
const database_1 = require("../../../database");
const get_1 = require("./get");
const get_members_1 = require("./get-members");
const delete_1 = require("./delete");
const delete_by_church_1 = require("./delete-by-church");
const useCases = [
    create_1.CreateUserSector,
    get_1.GetUserSector,
    get_members_1.GetUserSectorMembers,
    delete_1.DeleteUserSector,
    delete_by_church_1.DeleteUserSectorsByChurch
];
let UserSectorModule = class UserSectorModule {
};
exports.UserSectorModule = UserSectorModule;
exports.UserSectorModule = UserSectorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_1.DataBaseModule,
        ],
        providers: [...useCases],
        exports: [...useCases],
    })
], UserSectorModule);
//# sourceMappingURL=user-sector.module.js.map