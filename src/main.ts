import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './core/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix("/api/v1");
  app.useGlobalFilters(new AllExceptionsFilter());
  const config = new DocumentBuilder() 
    .setTitle('Auth Service')
    .setDescription('The Auth Service Api documentation')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT Authorization',
      in: 'header',
    }, "JWT-auth")
    .build();
  const document = SwaggerModule.createDocument(app, config); 
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();
