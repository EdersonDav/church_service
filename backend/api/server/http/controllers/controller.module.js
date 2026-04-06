"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerModule = void 0;
const common_1 = require("@nestjs/common");
const core_module_1 = require("../../../core/core.module");
const auth_1 = require("./auth");
const tasks_1 = require("./tasks");
const church_1 = require("./church");
const user_1 = require("./user");
const verify_code_1 = require("./verify-code");
const sector_1 = require("./sector");
const scale_1 = require("./scale");
const extra_events_1 = require("./extra-events");
const songs_1 = require("./songs");
const ministers_1 = require("./ministers");
const songs_2 = require("./scale/songs");
let ControllerModule = class ControllerModule {
};
exports.ControllerModule = ControllerModule;
exports.ControllerModule = ControllerModule = __decorate([
    (0, common_1.Module)({
        imports: [core_module_1.CoreModule],
        controllers: [
            auth_1.LoginController,
            tasks_1.TaskController,
            church_1.ChurchController,
            user_1.UserController,
            church_1.MembersController,
            verify_code_1.VerificationCodeController,
            sector_1.SectorController,
            sector_1.SectorMembersController,
            scale_1.ScaleController,
            songs_2.ScaleSongController,
            songs_1.SongController,
            ministers_1.MinisterController,
            extra_events_1.ExtraEventController,
        ],
    })
], ControllerModule);
//# sourceMappingURL=controller.module.js.map