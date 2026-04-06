"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeVerificationCodeRepository = void 0;
class FakeVerificationCodeRepository {
    constructor() {
        this.getLastCodeByUser = jest.fn();
        this.save = jest.fn();
        this.deleteByUserId = jest.fn();
        this.verifyCode = jest.fn();
    }
}
exports.FakeVerificationCodeRepository = FakeVerificationCodeRepository;
//# sourceMappingURL=verification-code.repository.js.map