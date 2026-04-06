"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChurchModule = void 0;
const common_1 = require("@nestjs/common");
const create_1 = require("./create");
const delete_1 = require("./delete");
const database_1 = require("../../../database");
const update_1 = require("./update");
const get_1 = require("./get");
const list_1 = require("./list");
const useCases = [
    create_1.CreateChurch,
    delete_1.DeleteChurch,
    update_1.UpdateChurch,
    get_1.GetChurch,
    list_1.ListChurches
];
let ChurchModule = class ChurchModule {
};
exports.ChurchModule = ChurchModule;
exports.ChurchModule = ChurchModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_1.DataBaseModule,
        ],
        providers: useCases,
        exports: useCases,
    })
], ChurchModule);
//# sourceMappingURL=church.module.js.map