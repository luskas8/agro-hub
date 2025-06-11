import {
  Controller,
  ForbiddenException,
  Get,
  HttpException,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
    example: 'OK',
  })
  @Get('health')
  healthCheck(): string {
    return 'OK';
  }

  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: HttpException,
    example: {
      message: 'Forbidden',
      statusCode: 403,
    },
  })
  @Get()
  index(): HttpException {
    throw new ForbiddenException('');
  }
}
