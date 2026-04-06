"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const common_1 = require("@nestjs/common");
exports.validator = new common_1.ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
        enableImplicitConversion: true,
    },
});
//# sourceMappingURL=validator.js.map