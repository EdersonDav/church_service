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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const helpers_1 = require("../../../core/helpers");
let UserService = class UserService {
    constructor(entity) {
        this.entity = entity;
    }
    async deleteByEmail(email) {
        await this.entity.delete({ email });
    }
    async getBy(search_value, search_by) {
        const userFound = await this.entity.findOne({ where: { [search_by]: search_value } });
        return userFound;
    }
    async save(user) {
        const userCreated = this.entity.create({ ...user, password: (0, helpers_1.hashString)(user.password) });
        const userSaved = await this.entity.save(userCreated);
        return userSaved;
    }
    async update(user_id, user_set) {
        const userFound = await this.entity.findOne({ where: { id: user_id } });
        if (user_set?.password) {
            user_set.password = (0, helpers_1.hashString)(user_set.password);
        }
        if (!userFound)
            throw new Error('User not found');
        const userUpdated = await this.entity.update({ id: user_id }, { ...user_set });
        if (!userUpdated.affected)
            return null;
        return await this.getBy(user_id, 'id');
    }
    async getNotVerifiedByEmail(email) {
        const userFound = await this.entity.findOne({ where: { email, is_verified: false } });
        return userFound;
    }
    async markAsVerified(user_id) {
        await this.entity.update({ id: user_id }, { is_verified: true });
    }
    async updatePassword(email, password) {
        const userUpdated = await this.entity.update({ email }, {
            password: (0, helpers_1.hashString)(password)
        });
        return !!userUpdated.affected;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map