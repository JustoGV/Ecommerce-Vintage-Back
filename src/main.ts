import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 4200;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
  
  return app;
}

// Para desarrollo local
if (require.main === module) {
  bootstrap();
}

// Para Vercel
let app: any;
export default async (req: any, res: any) => {
  if (!app) {
    app = await bootstrap();
  }
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
};
