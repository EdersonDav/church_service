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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participant = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base");
const enums_1 = require("../../enums");
const scales_entity_1 = require("./scales.entity");
const users_entity_1 = require("./users.entity");
const tasks_entity_1 = require("./tasks.entity");
let Participant = class Participant extends base_1.BaseEntity {
};
exports.Participant = Participant;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Participant.prototype, "task_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tasks_entity_1.Task, (task) => task.participants, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", tasks_entity_1.Task)
], Participant.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Participant.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.participants, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", users_entity_1.User)
], Participant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Participant.prototype, "scale_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => scales_entity_1.Scale, (scale) => scale.participants, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'scale_id' }),
    __metadata("design:type", scales_entity_1.Scale)
], Participant.prototype, "scale", void 0);
exports.Participant = Participant = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.PARTICIPANTS),
    (0, typeorm_1.Unique)(['scale_id', 'user_id', 'task_id'])
], Participant);
//# sourceMappingURL=participants.entity.js.map