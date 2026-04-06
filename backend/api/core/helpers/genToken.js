"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genToken = void 0;
const crypto_1 = require("crypto");
const genToken = () => (0, crypto_1.randomBytes)(32).toString('hex');
exports.genToken = genToken;
//# sourceMappingURL=genToken.js.map