"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeTaskRepository = void 0;
class FakeTaskRepository {
    constructor() {
        this.save = jest.fn();
        this.delete = jest.fn();
        this.findById = jest.fn();
        this.findBySector = jest.fn();
        this.update = jest.fn();
        this.findByIds = jest.fn();
    }
}
exports.FakeTaskRepository = FakeTaskRepository;
//# sourceMappingURL=task.repository.js.map