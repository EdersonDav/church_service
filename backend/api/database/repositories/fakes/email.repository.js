"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeEmailRepository = void 0;
class FakeEmailRepository {
    constructor() {
        this.sendResetPassword = jest.fn();
        this.sendVerificationCode = jest.fn();
        this.sendUserAlreadyExistsEmail = jest.fn();
    }
}
exports.FakeEmailRepository = FakeEmailRepository;
//# sourceMappingURL=email.repository.js.map