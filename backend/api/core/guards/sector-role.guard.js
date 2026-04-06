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
exports.SectorGuard = void 0;
const common_1 = require("@nestjs/common");
const user_church_1 = require("../use-cases/user-church");
const enums_1 = require("../../enums");
const user_sector_1 = require("../use-cases/user-sector");
let SectorGuard = class SectorGuard {
    constructor(getUserChurch, getUserSector) {
        this.getUserChurch = getUserChurch;
        this.getUserSector = getUserSector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userChurch = await this.getUserChurch.execute({
            user_id: user.id, church_id: request.params.church_id
        });
        if (userChurch?.data?.role === enums_1.ChurchRoleEnum.ADMIN ||
            userChurch?.data?.role === enums_1.ChurchRoleEnum.ROOT) {
            return true;
        }
        const sector_id = request.params.sector_id;
        const sectorUser = await this.getUserSector.execute({
            user_id: user.id,
            sector_id: sector_id
        });
        if (sectorUser?.data?.role === enums_1.SectorRoleEnum.ADMIN) {
            return true;
        }
        throw new common_1.UnauthorizedException('Você não tem permissão de administração neste setor');
    }
};
exports.SectorGuard = SectorGuard;
exports.SectorGuard = SectorGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_church_1.GetUserChurch,
        user_sector_1.GetUserSector])
], SectorGuard);
//# sourceMappingURL=sector-role.guard.js.map