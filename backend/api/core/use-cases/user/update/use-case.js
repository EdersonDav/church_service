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
exports.UpdateUser = void 0;
const common_1 = require("@nestjs/common");
const get_1 = require("../get");
const interfaces_1 = require("../../../../database/repositories/interfaces");
const helpers_1 = require("../../../helpers");
let UpdateUser = class UpdateUser {
    constructor(userRepository, getUser) {
        this.userRepository = userRepository;
        this.getUser = getUser;
    }
    async execute({ update_by, user_data }) {
        let id = user_data.id || '';
        if (!id) {
            const user = await this.getUser.execute({ search_by: update_by, search_data: user_data[update_by] });
            if (!user.data || !user.data.id) {
                throw new Error('Error during user update: user not found');
            }
            id = user.data.id;
        }
        const data = await this.userRepository.update(id, (0, helpers_1.removeNullUndefinedFields)(user_data));
        if (!data) {
            throw new Error('Error updating user');
        }
        return {
            data
        };
    }
};
exports.UpdateUser = UpdateUser;
exports.UpdateUser = UpdateUser = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.UserRepository,
        get_1.GetUser])
], UpdateUser);
//# sourceMappingURL=use-case.js.map