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
exports.GetUserSectorMembers = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../../../database/repositories/interfaces");
let GetUserSectorMembers = class GetUserSectorMembers {
    constructor(userSectorService) {
        this.userSectorService = userSectorService;
    }
    async execute(input) {
        const data = await this.userSectorService.getSectorMembers(input.sector_id);
        return {
            data
        };
    }
};
exports.GetUserSectorMembers = GetUserSectorMembers;
exports.GetUserSectorMembers = GetUserSectorMembers = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.UserSectorRepository])
], GetUserSectorMembers);
//# sourceMappingURL=use-case.js.map