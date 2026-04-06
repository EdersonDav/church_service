"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCasesModule = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("./auth");
const database_1 = require("../../database");
const tasks_1 = require("./tasks");
const church_1 = require("./church");
const user_1 = require("./user");
const verification_code_1 = require("./verification-code");
const password_reset_token_1 = require("./password-reset-token");
const emails_1 = require("./emails");
const user_church_1 = require("./user-church");
const sectors_1 = require("./sectors");
const user_sector_1 = require("./user-sector");
const scales_1 = require("./scales");
const unavailability_1 = require("./unavailability");
const user_task_1 = require("./user-task");
const extra_events_1 = require("./extra-events");
const songs_1 = require("./songs");
const ministers_1 = require("./ministers");
const minister_song_keys_1 = require("./minister-song-keys");
const scale_songs_1 = require("./scale-songs");
const modules = [
    tasks_1.TaskModule,
    church_1.ChurchModule,
    user_1.UserModule,
    verification_code_1.VerificationCodeModule,
    emails_1.EmailModule,
    password_reset_token_1.PasswordResetTokenModule,
    auth_1.AuthModule,
    user_church_1.UserChurchModule,
    sectors_1.SectorModule,
    user_sector_1.UserSectorModule,
    scales_1.ScaleModule,
    unavailability_1.UnavailabilityModule,
    user_task_1.UserTaskModule,
    extra_events_1.ExtraEventModule,
    songs_1.SongModule,
    ministers_1.MinisterModule,
    minister_song_keys_1.MinisterSongKeyModule,
    scale_songs_1.ScaleSongModule,
];
let UseCasesModule = class UseCasesModule {
};
exports.UseCasesModule = UseCasesModule;
exports.UseCasesModule = UseCasesModule = __decorate([
    (0, common_1.Module)({
        imports: [...modules, database_1.DataBaseModule],
        exports: [...modules],
    })
], UseCasesModule);
//# sourceMappingURL=use-cases.module.js.map