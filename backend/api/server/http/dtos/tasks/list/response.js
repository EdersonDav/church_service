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
exports.ListTasksResponse = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const task_dto_1 = require("../common/task.dto");
class ListTasksResponse {
}
exports.ListTasksResponse = ListTasksResponse;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => task_dto_1.TaskDto),
    (0, swagger_1.ApiProperty)({ type: task_dto_1.TaskDto, isArray: true }),
    __metadata("design:type", Array)
], ListTasksResponse.prototype, "tasks", void 0);
//# sourceMappingURL=response.js.map