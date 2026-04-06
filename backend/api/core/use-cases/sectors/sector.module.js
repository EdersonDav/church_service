"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorModule = void 0;
const common_1 = require("@nestjs/common");
const create_1 = require("./create");
const get_1 = require("./get");
const update_1 = require("./update");
const delete_1 = require("./delete");
const list_by_church_1 = require("./list-by-church");
const database_1 = require("../../../database");
const useCases = [create_1.CreateSector, get_1.GetSector, update_1.UpdateSector, delete_1.DeleteSector, list_by_church_1.ListSectorsByChurch];
let SectorModule = class SectorModule {
};
exports.SectorModule = SectorModule;
exports.SectorModule = SectorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_1.DataBaseModule,
        ],
        providers: [...useCases],
        exports: [...useCases],
    })
], SectorModule);
//# sourceMappingURL=sector.module.js.map