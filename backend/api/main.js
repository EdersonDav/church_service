"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./server/app/app.module");
const config_1 = require("./config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Gerenciamento de escalas')
        .setDescription('API voltada para gerenciamento de escalas nos cultos')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    const PORT = config_1.env.api.PORT || 5555;
    app.useGlobalPipes(config_1.validator);
    await app.listen(PORT, () => {
        console.log(`App running on port ${PORT} and environment ${config_1.env.api.NODE_ENV}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map