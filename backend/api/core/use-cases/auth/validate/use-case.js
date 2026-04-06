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
exports.ValidateUser = void 0;
const common_1 = require("@nestjs/common");
const get_1 = require("../../user/get");
const helpers_1 = require("../../../helpers");
let ValidateUser = class ValidateUser {
    constructor(getUser) {
        this.getUser = getUser;
    }
    async execute({ email, password }) {
        const { data } = await this.getUser.execute({ search_by: 'email', search_data: email });
        if (!data?.password || !(await (0, helpers_1.validateHash)({ value: password, hash: data.password })))
            return { data: null };
        return {
            data: {
                email: data.email || '',
                name: data.name || '',
                id: data.id || '',
                is_verified: data.is_verified || false,
            }
        };
    }
};
exports.ValidateUser = ValidateUser;
exports.ValidateUser = ValidateUser = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [get_1.GetUser])
], ValidateUser);
//# sourceMappingURL=use-case.js.map