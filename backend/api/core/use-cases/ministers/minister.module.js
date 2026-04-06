"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinisterModule = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../database");
const create_1 = require("./create");
const list_by_church_1 = require("./list-by-church");
const get_1 = require("./get");
const get_by_user_and_church_1 = require("./get-by-user-and-church");
const delete_1 = require("./delete");
const useCases = [
    create_1.CreateMinister,
    list_by_church_1.ListMinistersByChurch,
    get_1.GetMinister,
    get_by_user_and_church_1.GetMinisterByUserAndChurch,
    delete_1.DeleteMinister,
];
let MinisterModule = class MinisterModule {
};
exports.MinisterModule = MinisterModule;
exports.MinisterModule = MinisterModule = __decorate([
    (0, common_1.Module)({
        imports: [database_1.DataBaseModule],
        providers: [...useCases],
        exports: [...useCases],
    })
], MinisterModule);
//# sourceMappingURL=minister.module.js.map