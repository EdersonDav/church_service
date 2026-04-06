"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScaleModule = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../database");
const create_1 = require("./create");
const update_1 = require("./update");
const delete_1 = require("./delete");
const get_1 = require("./get");
const list_by_sector_1 = require("./list-by-sector");
const set_participants_1 = require("./set-participants");
const scale_songs_1 = require("../scale-songs");
const useCases = [
    create_1.CreateScale,
    update_1.UpdateScale,
    delete_1.DeleteScale,
    get_1.GetScale,
    list_by_sector_1.ListScalesBySector,
    set_participants_1.SetScaleParticipants,
];
let ScaleModule = class ScaleModule {
};
exports.ScaleModule = ScaleModule;
exports.ScaleModule = ScaleModule = __decorate([
    (0, common_1.Module)({
        imports: [database_1.DataBaseModule, scale_songs_1.ScaleSongModule],
        providers: [...useCases],
        exports: [...useCases],
    })
], ScaleModule);
//# sourceMappingURL=scale.module.js.map