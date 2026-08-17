import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  welcome() {
    const appName = this.configService.get<string>(
      'app.name',
      'NestJS REST Starter',
    );
    const apiPrefix = this.configService.get<string>('apiPrefix', 'api');
    return {
      message: `Welcome to ${appName}`,
      docs: `/${apiPrefix}/docs`,
      health: `/${apiPrefix}/v1/health`,
    };
  }
}
