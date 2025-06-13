import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Cultivation, Farm } from '@prisma/client';
import { RuralProducerService } from '@src/rural-producer/rural-producer.service';
import { CreateFarmCultivationDto } from './dto/create-farm-cultivation.dto';
import { CreateFarmDto } from './dto/create-farm.dto';
import {
  FarmQueryParamsDto,
  OmitProduceIdFarmsQueryDto,
} from './dto/farm-query-params.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmService } from './farm.service';
import { FarmSizeUseCase } from './use-cases/farm-size.use-case';

@Controller('farm')
export class FarmController {
  private readonly logger = new Logger(FarmController.name);
  private readonly farnSizeUseCase = new FarmSizeUseCase();
  constructor(
    private readonly farmService: FarmService,
    private readonly ruralProducerService: RuralProducerService,
  ) {}

  @Post()
  async create(
    @Body(ValidationPipe) createFarmDto: CreateFarmDto,
  ): Promise<Farm | HttpException> {
    if (!this.farnSizeUseCase.execute(createFarmDto)) {
      this.logger.verbose(
        `Fazenda não criada, tamanho inválido: ${JSON.stringify(createFarmDto)}`,
      );
      throw new BadRequestException('Fazenda não criada, tamanho inválido', {
        cause: 'INVALID_FARM_SIZE',
        description:
          'A soma das áreas de vegetação e agricultável não pode exceder a área total da fazenda.',
      });
    }
    const producer = await this.ruralProducerService.findOne(
      createFarmDto.producerId,
    );
    if (!producer) {
      throw new BadRequestException(
        'Fazenda não criada, produtor rural não encontrado/inexistente',
        {
          cause: 'PRODUCER_NOT_FOUND',
          description:
            'O produtor rural associado à fazenda não foi encontrado.',
        },
      );
    }

    const farm = await this.farmService.create(createFarmDto);
    if (!farm) {
      this.logger.warn(
        `Erro ao criar fazenda: ${JSON.stringify(createFarmDto)}`,
      );
      throw new InternalServerErrorException(
        'Fazenda não criada, erro interno no servidor',
        {
          cause: 'FARM_CREATION_FAILED',
          description: 'Ocorreu um erro ao criar a fazenda.',
        },
      );
    }

    return farm;
  }

  @Get()
  findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    queryParams: OmitProduceIdFarmsQueryDto,
  ): Promise<Farm[]> {
    return this.farmService.findAll(queryParams);
  }

  @Get('dashboard/totals')
  async farmDashboardTotals(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    queryParams: FarmQueryParamsDto,
  ): Promise<{
    totalFarms: number;
    totalArea: number;
  }> {
    const reseult = await this.farmService.farmDashboardTotals(queryParams);
    return reseult;
  }

  @Get('dashboard/aggregate/states')
  async farmDashboardAggregateStates(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    queryParams: FarmQueryParamsDto,
  ): Promise<
    {
      state: string;
      totalFarms: number;
    }[]
  > {
    const result =
      await this.farmService.farmDashboardAggregateStates(queryParams);
    return result;
  }

  @Get('rural-producer/:producerId')
  async findByRuralProducerId(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    queryParams: OmitProduceIdFarmsQueryDto,
    @Param('producerId', ParseUUIDPipe) producerId: string,
  ): Promise<Farm[] | HttpException> {
    return await this.farmService.findByRuralProducerId(
      producerId,
      queryParams,
    );
  }

  @Get(':id')
  async findOne(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    queryParams: OmitProduceIdFarmsQueryDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Farm | HttpException> {
    const farm = await this.farmService.findOne(id, queryParams);
    if (!farm) {
      throw new NotFoundException(
        `Fazenda com ID: ${id} não encontrada`,
        'FARM_NOT_FOUND',
      );
    }

    return farm;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFarmDto: UpdateFarmDto,
  ): Promise<Farm | HttpException> {
    const farm = await this.farmService.findOne(id);
    if (!farm) {
      throw new NotFoundException(
        `Fazenda com ID: ${id} não encontrada para atualização`,
        'FARM_NOT_FOUND',
      );
    }
    if (updateFarmDto.producerId !== farm.producerId) {
      this.logger.verbose({
        code: 'FARM_RURAL_PRODUCER_UPDATE',
        oldProducerId: farm.producerId,
        newProducerId: updateFarmDto.producerId,
        farmId: id,
      });
      const producer = await this.ruralProducerService.findOne(
        updateFarmDto.producerId!,
      );
      if (!producer) {
        throw new BadRequestException(
          'Fazenda não atualizada, produtor rural não encontrado/inexistente',
          {
            cause: 'PRODUCER_NOT_FOUND',
            description:
              'O produtor rural associado à fazenda não foi encontrado.',
          },
        );
      }
    }

    const updated = await this.farmService.update(id, updateFarmDto);
    if (!updated) {
      this.logger.warn(`Fazenda com ID: ${id} não atualizada`);
      throw new InternalServerErrorException(
        'Fazenda não atualizada, erro interno no servidor',
        {
          cause: 'FARM_UPDATE_FAILED',
          description: 'Ocorreu um erro ao atualizar a fazenda.',
        },
      );
    }

    return updated;
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Farm | HttpException> {
    const farm = await this.farmService.findOne(id);
    if (!farm) {
      throw new NotFoundException(
        `Fazenda com ID: ${id} não encontrada para remoção`,
        'FARM_NOT_FOUND',
      );
    }

    this.logger.verbose({
      code: 'FARM_DEACTIVATION',
      farmId: id,
    });
    const result = await this.farmService.remove(id);
    if (!result) {
      this.logger.warn(`Fazenda com ID: ${id} não desativada`);
      throw new InternalServerErrorException(
        'Fazenda não desativada, erro interno no servidor',
        {
          cause: 'FARM_DELETION_FAILED',
          description: 'Ocorreu um erro ao desativar a fazenda.',
        },
      );
    }

    return farm;
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
    cultivationDto: CreateFarmCultivationDto,
  ): Promise<Cultivation | HttpException> {
    const farm = await this.farmService.findOne(id);
    if (!farm) {
      throw new NotFoundException(
        `Fazenda com ID: ${id} não encontrada para adicionar cultivo`,
        'FARM_NOT_FOUND',
      );
    }
    const harvest = await this.farmService.getOrCreateHarvest(
      id,
      cultivationDto.harvestYear,
    );
    if (!harvest) {
      this.logger.warn(
        `Erro ao obter ou criar safra para fazenda com ID: ${id}`,
      );
      throw new InternalServerErrorException(
        'Erro ao obter ou criar safra para a fazenda',
        {
          cause: 'HARVEST_CREATION_FAILED',
          description: 'Ocorreu um erro ao obter ou criar a safra.',
        },
      );
    }

    const cultivation = await this.farmService.addCultivation(
      harvest.id,
      cultivationDto.name,
    );
    if (!cultivation) {
      this.logger.warn(
        `Erro ao adicionar cultivo: ${JSON.stringify(cultivationDto)} na fazenda com ID: ${id}`,
      );
      throw new InternalServerErrorException(
        'Cultivo não adicionado, erro interno no servidor',
        {
          cause: 'CULTIVATION_CREATION_FAILED',
          description: 'Ocorreu um erro ao adicionar o cultivo.',
        },
      );
    }

    return cultivation;
  }
}
