"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakePasswordResetTokenRepository = void 0;
class FakePasswordResetTokenRepository {
    constructor() {
        this.save = jest.fn();
        this.deleteByUserId = jest.fn();
        this.verifyToken = jest.fn();
    }
}
exports.FakePasswordResetTokenRepository = FakePasswordResetTokenRepository;
//# sourceMappingURL=password-reset-tokens.repository.js.map