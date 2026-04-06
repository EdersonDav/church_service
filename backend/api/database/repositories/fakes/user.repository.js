"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeUserRepository = void 0;
class FakeUserRepository {
    constructor() {
        this.getBy = jest.fn();
        this.save = jest.fn();
        this.update = jest.fn();
        this.deleteByEmail = jest.fn();
        this.getNotVerifiedByEmail = jest.fn();
        this.markAsVerified = jest.fn();
        this.updatePassword = jest.fn();
    }
}
exports.FakeUserRepository = FakeUserRepository;
//# sourceMappingURL=user.repository.js.map