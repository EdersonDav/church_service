"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScaleSongModule = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../database");
const set_1 = require("./set");
const list_by_scale_1 = require("./list-by-scale");
const recalculate_keys_1 = require("./recalculate-keys");
const useCases = [
    set_1.SetScaleSongs,
    list_by_scale_1.ListScaleSongs,
    recalculate_keys_1.RecalculateScaleSongKeys,
];
let ScaleSongModule = class ScaleSongModule {
};
exports.ScaleSongModule = ScaleSongModule;
exports.ScaleSongModule = ScaleSongModule = __decorate([
    (0, common_1.Module)({
        imports: [database_1.DataBaseModule],
        providers: [...useCases],
        exports: [...useCases],
    })
], ScaleSongModule);
//# sourceMappingURL=scale-song.module.js.map