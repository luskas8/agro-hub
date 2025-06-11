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
import { CreateRuralProducerDto } from './dto/create-rural-producer.dto';
import { UpdateRuralProducerDto } from './dto/update-rural-producer.dto';
import { DocumentTypePipe } from './pipes/document-type';
import { RuralProducerService } from './rural-producer.service';

@Controller('rural-producer')
export class RuralProducerController {
  private readonly logger = new Logger(RuralProducerController.name);

  constructor(private readonly RuralProducerService: RuralProducerService) {}

  @Post()
  async create(
    @Body(DocumentTypePipe, ValidationPipe)
    createRuralProducerDto: CreateRuralProducerDto,
  ): Promise<Prisma.RuralProducerCreateInput> {
    this.logger.verbose(
      `Creating rural productor with data: ${JSON.stringify(createRuralProducerDto)}`,
    );
    return await this.RuralProducerService.create(createRuralProducerDto);
  }

  @Get()
  async findAll(): Promise<Prisma.RuralProducerCreateInput[]> {
    this.logger.debug('Finding all rural productors');
    return await this.RuralProducerService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Prisma.RuralProducerCreateInput> {
    this.logger.verbose(`Finding rural productor with ID: ${id}`);
    const data = await this.RuralProducerService.findOne(id);
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
    updateRuralProducerDto: UpdateRuralProducerDto,
  ): Promise<Prisma.RuralProducerUpdateInput> {
    this.logger.warn(`Updating rural productor with ID: ${id}`);
    return this.RuralProducerService.update(id, updateRuralProducerDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Prisma.RuralProducerUpdateInput> {
    this.logger.log(`Removing rural productor with ID: ${id}`);
    return this.RuralProducerService.remove(id);
  }
}
