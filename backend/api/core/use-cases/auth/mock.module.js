"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAuthModule = void 0;
const common_1 = require("@nestjs/common");
const create_1 = require("./create");
const validate_1 = require("./validate");
const mock_module_1 = require("../../../database/mock.module");
const jwt_1 = require("@nestjs/jwt");
const jwt_service_1 = require("../../../database/repositories/fakes/jwt.service");
const useCases = [create_1.CreateToken, validate_1.ValidateUser];
let MockAuthModule = class MockAuthModule {
};
exports.MockAuthModule = MockAuthModule;
exports.MockAuthModule = MockAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [mock_module_1.MockDatabaseModule],
        providers: [
            ...useCases,
            {
                provide: jwt_1.JwtService,
                useClass: jwt_service_1.FakeJWT,
            },
        ],
        exports: useCases,
    })
], MockAuthModule);
//# sourceMappingURL=mock.module.js.map