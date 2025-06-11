import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateRuralProductorDto } from './dto/create-rural-productor.dto';
import { UpdateRuralProductorDto } from './dto/update-rural-productor.dto';
import { DocumentTypePipe } from './pipes/document-type';
import { RuralProductorService } from './rural-productor.service';

@Controller('rural-productor')
export class RuralProductorController {
  private readonly logger = new Logger(RuralProductorController.name);

  constructor(private readonly ruralProductorService: RuralProductorService) {}

  @Post()
  async create(
    @Body(DocumentTypePipe, ValidationPipe)
    createRuralProductorDto: CreateRuralProductorDto,
  ): Promise<Prisma.RuralProductorCreateInput> {
    this.logger.verbose(
      `Creating rural productor with data: ${JSON.stringify(createRuralProductorDto)}`,
    );
    return await this.ruralProductorService.create(createRuralProductorDto);
  }

  @Get()
  async findAll(): Promise<Prisma.RuralProductorCreateInput[]> {
    this.logger.debug('Finding all rural productors');
    return await this.ruralProductorService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Prisma.RuralProductorCreateInput> {
    this.logger.verbose(`Finding rural productor with ID: ${id}`);
    const data = await this.ruralProductorService.findOne(id);
    if (!data) {
      this.logger.warn(`Rural productor with ID: ${id} not found`);
      throw new NotFoundException(`Rural productor with ID: ${id} not found`);
    }

    return data;
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe)
    updateRuralProductorDto: UpdateRuralProductorDto,
  ): Promise<Prisma.RuralProductorUpdateInput> {
    this.logger.warn(`Updating rural productor with ID: ${id}`);
    return this.ruralProductorService.update(id, updateRuralProductorDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Prisma.RuralProductorUpdateInput> {
    this.logger.log(`Removing rural productor with ID: ${id}`);
    return this.ruralProductorService.remove(id);
  }
}
