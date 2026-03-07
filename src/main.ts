import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SeederService } from 'src/modules/seeder/seeder.service';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('apiPrefix', 'api');

  const isProduction = configService.get<string>('nodeEnv') === 'production';

  app.enableCors({ origin: configService.get<string>('corsOrigin', '*') });
  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix(apiPrefix, { exclude: ['/'] });

  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle(configService.get<string>('app.name') || 'Default App Name')
      .setDescription(
        configService.get<string>('app.description') ||
          'Default App Description',
      )
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    await app.get(SeederService).seed();
  }

  await app.listen(configService.get<number>('port', 3000));
}
void bootstrap();
