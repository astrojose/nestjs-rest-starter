import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from 'src/database/database.module';
import { AppConfigModule } from 'src/config/app-config.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { SeederModule } from './modules/seeder/seeder.module';
import { LoggerModule } from 'src/lib/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { ResponseTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { GlobalValidationPipe } from 'src/common/pipes/global-validation.pipe';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UsersModule,
    RolesModule,
    SeederModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
  ],
})
export class AppModule {}
