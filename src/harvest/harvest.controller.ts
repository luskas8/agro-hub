import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { Cultivation, Harvest } from '@prisma/client';
import { FarmService } from '@src/farm/farm.service';
import { CreateHarvestCultivationDto } from './dto/create-harvest-cultivation.dto';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { HarvestService } from './harvest.service';

@Controller('harvest')
export class HarvestController {
  constructor(
    private readonly harvestService: HarvestService,
    private readonly farmService: FarmService,
  ) {}

  @Post()
  async create(
    @Body(ValidationPipe) dto: CreateHarvestDto,
  ): Promise<Harvest | HttpException> {
    const farm = await this.farmService.findOne(dto.farmId);
    if (!farm) {
      throw new BadRequestException('Farm not found');
    }

    if (await this.harvestService.isDuplicate(dto.farmId, dto.harvestYear)) {
      throw new BadRequestException('Duplicate harvest year for this farm');
    }

    const harvest = await this.harvestService.create(dto);
    if (!harvest) {
      throw new InternalServerErrorException('Failed to create harvest');
    }

    return harvest;
  }

  @Post(':id/cultivation')
  async addCultivation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    dto: CreateHarvestCultivationDto,
  ): Promise<Cultivation | HttpException> {
    const harvest = await this.harvestService.findOne(id);
    if (!harvest) {
      throw new NotFoundException('Harvest not found');
    }

    const cultivation = await this.harvestService.addCultivation(id, dto);
    if (!cultivation) {
      throw new InternalServerErrorException('Failed to add cultivation');
    }

    return cultivation;
  }

  @Get('farm/:farmId')
  async findByFarmId(@Param('farmId', ParseUUIDPipe) farmId: string) {
    return this.harvestService.findByFarmId(farmId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Harvest | HttpException> {
    const harvest = await this.harvestService.findOne(id);
    if (!harvest) {
      throw new NotFoundException('Harvest not found');
    }

    return harvest;
  }
}
