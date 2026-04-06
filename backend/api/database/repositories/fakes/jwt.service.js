"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeJWT = void 0;
const jwt_1 = require("@nestjs/jwt");
class FakeJWT extends jwt_1.JwtService {
    constructor() {
        super(...arguments);
        this.sign = jest.fn();
        this.signAsync = jest.fn();
        this.verify = jest.fn();
        this.verifyAsync = jest.fn();
        this.decode = jest.fn();
    }
}
exports.FakeJWT = FakeJWT;
//# sourceMappingURL=jwt.service.js.map