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
exports.CreateUser = void 0;
const common_1 = require("@nestjs/common");
const use_case_1 = require("../get-no-verified/use-case");
const use_case_2 = require("../update/use-case");
const interfaces_1 = require("../../../../database/repositories/interfaces");
let CreateUser = class CreateUser {
    constructor(userRepository, getNotVerifiedUser, updateUser) {
        this.userRepository = userRepository;
        this.getNotVerifiedUser = getNotVerifiedUser;
        this.updateUser = updateUser;
    }
    async execute(input) {
        const userFound = await this.getNotVerifiedUser.execute({ email: input.email });
        if (userFound.data) {
            return await this.updateUser.execute({ update_by: 'id', user_data: input });
        }
        const data = await this.userRepository.save(input);
        return {
            data
        };
    }
};
exports.CreateUser = CreateUser;
exports.CreateUser = CreateUser = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.UserRepository,
        use_case_1.GetNotVerifiedUser,
        use_case_2.UpdateUser])
], CreateUser);
//# sourceMappingURL=use-case.js.map