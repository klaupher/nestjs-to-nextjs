import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //valida o DTO
      forbidNonWhitelisted: true, //mostra erros em caso de chaves extras no payload
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
