"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanString = void 0;
const cleanString = (input, options) => {
    const { allowWhitespace = false, allowAccents = false, allowUnderscore = false, allowDash = false, } = options || {};
    let pattern = 'a-zA-Z0-9';
    if (allowWhitespace)
        pattern += '\\s';
    if (allowUnderscore)
        pattern += '_';
    if (allowDash)
        pattern += '\\-';
    let regex = new RegExp(`[^${pattern}]`, 'g');
    let result = input.replace(regex, '');
    if (!allowAccents) {
        result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return result.replaceAll('$', '');
};
exports.cleanString = cleanString;
//# sourceMappingURL=cleanString.js.map