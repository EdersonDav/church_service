"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtraEventController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const extra_events_1 = require("../../../../core/use-cases/extra-events");
const user_church_1 = require("../../../../core/use-cases/user-church");
const guards_1 = require("../../../../core/guards");
const common_2 = require("../../../../common");
const dtos_1 = require("../../dtos");
let ExtraEventController = class ExtraEventController {
    constructor(createExtraEvent, listExtraEventsByChurch, getExtraEvent, updateExtraEvent, deleteExtraEvent, getUserChurch) {
        this.createExtraEvent = createExtraEvent;
        this.listExtraEventsByChurch = listExtraEventsByChurch;
        this.getExtraEvent = getExtraEvent;
        this.updateExtraEvent = updateExtraEvent;
        this.deleteExtraEvent = deleteExtraEvent;
        this.getUserChurch = getUserChurch;
    }
    async ensureMembership(user_id, church_id) {
        const { data } = await this.getUserChurch.execute({ user_id, church_id });
        if (!data) {
            throw new common_1.ForbiddenException('Access denied');
        }
    }
    async ensureEventBelongsToChurch(event_id, church_id) {
        const { data } = await this.getExtraEvent.execute({ event_id });
        if (!data) {
            throw new common_1.NotFoundException('Event not found');
        }
        if (data.church_id !== church_id) {
            throw new common_1.BadRequestException('Event does not belong to this church');
        }
        return data;
    }
    async create(church_id, body) {
        const date = new Date(body.date);
        if (Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Invalid date');
        }
        const { data } = await this.createExtraEvent.execute({
            church_id,
            name: body.name,
            description: body.description,
            type: body.type,
            date,
        });
        return (0, class_transformer_1.plainToClass)(dtos_1.CreateExtraEventResponse, data, {
            excludeExtraneousValues: true,
        });
    }
    async list(church_id, user) {
        await this.ensureMembership(user.id, church_id);
        const { data } = await this.listExtraEventsByChurch.execute({ church_id });
        return (0, class_transformer_1.plainToClass)(dtos_1.ListExtraEventsResponse, { events: data }, {
            excludeExtraneousValues: true,
        });
    }
    async get(church_id, event_id, user) {
        await this.ensureMembership(user.id, church_id);
        const data = await this.ensureEventBelongsToChurch(event_id, church_id);
        return (0, class_transformer_1.plainToClass)(dtos_1.GetExtraEventResponse, { event: data }, {
            excludeExtraneousValues: true,
        });
    }
    async update(church_id, event_id, body) {
        await this.ensureEventBelongsToChurch(event_id, church_id);
        if (!body.name && !body.description && !body.type && !body.date) {
            throw new common_1.BadRequestException('No changes provided');
        }
        const date = body.date ? new Date(body.date) : undefined;
        if (date && Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Invalid date');
        }
        const { data } = await this.updateExtraEvent.execute({
            event_id,
            event_data: {
                name: body.name,
                description: body.description,
                type: body.type,
                date,
            },
        });
        if (!data) {
            throw new common_1.NotFoundException('Event not found');
        }
        return (0, class_transformer_1.plainToClass)(dtos_1.UpdateExtraEventResponse, data, {
            excludeExtraneousValues: true,
        });
    }
    async delete(church_id, event_id) {
        await this.ensureEventBelongsToChurch(event_id, church_id);
        await this.deleteExtraEvent.execute({ event_id });
        return { message: 'Event deleted successfully' };
    }
};
exports.ExtraEventController = ExtraEventController;
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Criar evento extra relacionado à igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String, description: 'Identificador da igreja' }),
    (0, swagger_1.ApiBody)({ type: dtos_1.CreateExtraEventBody }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Evento criado com sucesso',
        type: dtos_1.CreateExtraEventResponse,
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.CreateExtraEventBody]),
    __metadata("design:returntype", Promise)
], ExtraEventController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar eventos extras da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String, description: 'Identificador da igreja' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Eventos listados com sucesso',
        type: dtos_1.ListExtraEventsResponse,
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExtraEventController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':event_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Consultar evento extra por identificador' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String, description: 'Identificador da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'event_id', type: String, description: 'Identificador do evento' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Evento encontrado com sucesso',
        type: dtos_1.GetExtraEventResponse,
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('event_id')),
    __param(2, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ExtraEventController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':event_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar evento extra' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String, description: 'Identificador da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'event_id', type: String, description: 'Identificador do evento' }),
    (0, swagger_1.ApiBody)({ type: dtos_1.UpdateExtraEventBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Evento atualizado com sucesso',
        type: dtos_1.UpdateExtraEventResponse,
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('event_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.UpdateExtraEventBody]),
    __metadata("design:returntype", Promise)
], ExtraEventController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':event_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir evento extra' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String, description: 'Identificador da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'event_id', type: String, description: 'Identificador do evento' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Evento removido com sucesso',
        schema: {
            example: {
                message: 'Event deleted successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('event_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExtraEventController.prototype, "delete", null);
exports.ExtraEventController = ExtraEventController = __decorate([
    (0, swagger_1.ApiTags)('Eventos Extras'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('churches/:church_id/events'),
    __metadata("design:paramtypes", [extra_events_1.CreateExtraEvent,
        extra_events_1.ListExtraEventsByChurch,
        extra_events_1.GetExtraEvent,
        extra_events_1.UpdateExtraEvent,
        extra_events_1.DeleteExtraEvent,
        user_church_1.GetUserChurch])
], ExtraEventController);
//# sourceMappingURL=controller.js.map