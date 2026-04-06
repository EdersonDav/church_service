"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockDatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("./repositories/interfaces");
const fakes_1 = require("./repositories/fakes");
let MockDatabaseModule = class MockDatabaseModule {
};
exports.MockDatabaseModule = MockDatabaseModule;
exports.MockDatabaseModule = MockDatabaseModule = __decorate([
    (0, common_1.Module)({
        providers: [
            fakes_1.FakeUserRepository,
            {
                provide: interfaces_1.UserRepository,
                useClass: fakes_1.FakeUserRepository,
            },
            fakes_1.FakeTaskRepository,
            {
                provide: interfaces_1.TaskRepository,
                useClass: fakes_1.FakeTaskRepository,
            },
            fakes_1.FakeChurchRepository,
            {
                provide: interfaces_1.ChurchRepository,
                useClass: fakes_1.FakeChurchRepository,
            },
            fakes_1.FakeVerificationCodeRepository,
            {
                provide: interfaces_1.VerificationCodeRepository,
                useClass: fakes_1.FakeVerificationCodeRepository,
            },
            fakes_1.FakeEmailRepository,
            {
                provide: interfaces_1.EmailRepository,
                useClass: fakes_1.FakeEmailRepository,
            }
        ],
        exports: [
            interfaces_1.UserRepository,
            fakes_1.FakeUserRepository,
            fakes_1.FakeTaskRepository,
            interfaces_1.TaskRepository,
            interfaces_1.ChurchRepository,
            fakes_1.FakeChurchRepository,
            interfaces_1.VerificationCodeRepository,
            fakes_1.FakeVerificationCodeRepository,
            interfaces_1.EmailRepository,
            fakes_1.FakeEmailRepository
        ],
    })
], MockDatabaseModule);
//# sourceMappingURL=mock.module.js.map