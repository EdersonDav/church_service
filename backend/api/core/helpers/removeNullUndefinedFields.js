"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNullUndefinedFields = void 0;
const removeNullUndefinedFields = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined));
};
exports.removeNullUndefinedFields = removeNullUndefinedFields;
//# sourceMappingURL=removeNullUndefinedFields.js.map