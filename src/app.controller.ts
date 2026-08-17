import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { AppService } from './app.service';

@ApiTags('Welcome')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'API welcome information' })
  welcome() {
    return this.appService.welcome();
  }
}
