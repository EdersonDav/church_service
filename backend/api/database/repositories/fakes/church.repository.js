"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeChurchRepository = void 0;
class FakeChurchRepository {
    constructor() {
        this.save = jest.fn();
        this.delete = jest.fn();
        this.update = jest.fn();
        this.getBy = jest.fn();
        this.list = jest.fn();
    }
}
exports.FakeChurchRepository = FakeChurchRepository;
//# sourceMappingURL=church.repository.js.map