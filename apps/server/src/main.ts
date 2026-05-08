import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// logging
import { LoggingService } from './common/logging/logging.service.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';

const port = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // logging
  const logger = app.get(LoggingService);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error.stack);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(
      'Unhandled Rejection',
      reason instanceof Error ? reason.stack : String(reason),
    );
  });

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Fullstack monorepo server')
    .setDescription('Description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'openapi-json',
  });

  await app.listen(port);
}
bootstrap();
