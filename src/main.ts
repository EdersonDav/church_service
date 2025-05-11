import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './server/app/app.module';
import { env, validator } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Gerenciamento de escalas')
    .setDescription('API voltada para gerenciamento de escalas nos cultos')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  const PORT = env.api.PORT || 5555;
  app.useGlobalPipes(validator);
  await app.listen(PORT, () => {
    console.log(
      `App running on port ${PORT} and environment ${env.api.NODE_ENV}`,
    );
  });
}
bootstrap();
