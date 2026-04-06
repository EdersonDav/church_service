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
exports.ChurchRoleGuard = void 0;
const common_1 = require("@nestjs/common");
const get_1 = require("../use-cases/user-church/get");
const enums_1 = require("../../enums");
let ChurchRoleGuard = class ChurchRoleGuard {
    constructor(userChurchService) {
        this.userChurchService = userChurchService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const church_id = request.params.church_id;
        const { data: relation } = await this.userChurchService.execute({ user_id: user.id, church_id: church_id });
        if (!relation || relation.role === enums_1.ChurchRoleEnum.VOLUNTARY) {
            throw new common_1.UnauthorizedException();
        }
        request['userChurch'] = relation;
        return true;
    }
};
exports.ChurchRoleGuard = ChurchRoleGuard;
exports.ChurchRoleGuard = ChurchRoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [get_1.GetUserChurch])
], ChurchRoleGuard);
//# sourceMappingURL=church-role.guard.js.map