"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genExpiredDate = void 0;
const genExpiredDate = (minutes = 10) => new Date(new Date().getTime() + 1000 * 60 * Number(minutes));
exports.genExpiredDate = genExpiredDate;
//# sourceMappingURL=genExpiredDate.js.map