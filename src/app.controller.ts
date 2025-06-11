import {
  Controller,
  ForbiddenException,
  Get,
  HttpException,
} from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  healthCheck(): string {
    return 'OK';
  }

  @Get()
  index(): HttpException {
    throw new ForbiddenException('');
  }
}
