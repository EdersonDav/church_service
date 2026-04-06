"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("../config");
const services_1 = require("./repositories/services");
const interfaces_1 = require("./repositories/interfaces");
const entities_1 = require("./entities");
const entities = [
    entities_1.User,
    entities_1.Task,
    entities_1.Song,
    entities_1.Minister,
    entities_1.MinisterSongKey,
    entities_1.Church,
    entities_1.Participant,
    entities_1.Scale,
    entities_1.Sector,
    entities_1.Unavailability,
    entities_1.UserChurch,
    entities_1.UserTask,
    entities_1.VerificationCode,
    entities_1.PasswordResetToken,
    entities_1.UserSector,
    entities_1.ExtraEvent,
    entities_1.ScaleSong
];
let DataBaseModule = class DataBaseModule {
};
exports.DataBaseModule = DataBaseModule;
exports.DataBaseModule = DataBaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: config_1.env.db.HOST,
                port: config_1.env.db.PORT,
                database: config_1.env.db.NAME,
                entities: entities,
                password: config_1.env.db.PASSWORD,
                username: config_1.env.db.USER,
                synchronize: false,
            }),
            typeorm_1.TypeOrmModule.forFeature(entities),
        ],
        providers: [
            services_1.UserService,
            {
                provide: interfaces_1.UserRepository,
                useClass: services_1.UserService,
            },
            services_1.TaskService,
            {
                provide: interfaces_1.TaskRepository,
                useClass: services_1.TaskService
            },
            services_1.SongService,
            {
                provide: interfaces_1.SongRepository,
                useClass: services_1.SongService
            },
            services_1.MinisterService,
            {
                provide: interfaces_1.MinisterRepository,
                useClass: services_1.MinisterService,
            },
            services_1.MinisterSongKeyService,
            {
                provide: interfaces_1.MinisterSongKeyRepository,
                useClass: services_1.MinisterSongKeyService,
            },
            services_1.ChurchService,
            {
                provide: interfaces_1.ChurchRepository,
                useClass: services_1.ChurchService
            },
            services_1.VerificationCodeService,
            {
                provide: interfaces_1.VerificationCodeRepository,
                useClass: services_1.VerificationCodeService,
            },
            services_1.EmailService,
            {
                provide: interfaces_1.EmailRepository,
                useClass: services_1.EmailService,
            },
            services_1.PasswordResetTokenService,
            {
                provide: interfaces_1.PasswordResetTokenRepository,
                useClass: services_1.PasswordResetTokenService,
            },
            services_1.UserChurchService,
            {
                provide: interfaces_1.UserChurchRepository,
                useClass: services_1.UserChurchService,
            },
            services_1.SectorService,
            {
                provide: interfaces_1.SectorRepository,
                useClass: services_1.SectorService,
            },
            services_1.UserSectorService,
            {
                provide: interfaces_1.UserSectorRepository,
                useClass: services_1.UserSectorService,
            },
            services_1.ScaleService,
            {
                provide: interfaces_1.ScaleRepository,
                useClass: services_1.ScaleService,
            },
            services_1.ParticipantService,
            {
                provide: interfaces_1.ParticipantRepository,
                useClass: services_1.ParticipantService,
            },
            services_1.UnavailabilityService,
            {
                provide: interfaces_1.UnavailabilityRepository,
                useClass: services_1.UnavailabilityService,
            },
            services_1.UserTaskService,
            {
                provide: interfaces_1.UserTaskRepository,
                useClass: services_1.UserTaskService,
            },
            services_1.ExtraEventService,
            {
                provide: interfaces_1.ExtraEventRepository,
                useClass: services_1.ExtraEventService,
            },
            services_1.ScaleSongService,
            {
                provide: interfaces_1.ScaleSongRepository,
                useClass: services_1.ScaleSongService,
            }
        ],
        exports: [
            interfaces_1.UserRepository,
            services_1.UserService,
            interfaces_1.TaskRepository,
            services_1.TaskService,
            interfaces_1.SongRepository,
            services_1.SongService,
            interfaces_1.MinisterRepository,
            services_1.MinisterService,
            interfaces_1.MinisterSongKeyRepository,
            services_1.MinisterSongKeyService,
            interfaces_1.ChurchRepository,
            services_1.ChurchService,
            interfaces_1.VerificationCodeRepository,
            services_1.VerificationCodeService,
            interfaces_1.EmailRepository,
            services_1.EmailService,
            interfaces_1.PasswordResetTokenRepository,
            services_1.PasswordResetTokenService,
            interfaces_1.UserChurchRepository,
            services_1.UserChurchService,
            interfaces_1.SectorRepository,
            services_1.SectorService,
            interfaces_1.UserSectorRepository,
            services_1.UserSectorService,
            interfaces_1.ScaleRepository,
            services_1.ScaleService,
            interfaces_1.ParticipantRepository,
            services_1.ParticipantService,
            interfaces_1.UnavailabilityRepository,
            services_1.UnavailabilityService,
            interfaces_1.UserTaskRepository,
            services_1.UserTaskService,
            interfaces_1.ExtraEventRepository,
            services_1.ExtraEventService,
            interfaces_1.ScaleSongRepository,
            services_1.ScaleSongService
        ],
    })
], DataBaseModule);
//# sourceMappingURL=database.module.js.map