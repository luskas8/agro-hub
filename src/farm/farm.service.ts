import { PrismaService } from '@app-prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Farm, Prisma } from '@prisma/client';
import { CreateFarmDto } from './dto/create-farm.dto';
import {
  OmitProduceIdFarmsQueryDto,
  FarmQueryParamsDto,
} from './dto/farm-query-params.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmService {
  private readonly logger = new Logger(FarmService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm | null> {
    try {
      const farm = await this.prismaService.farm.create({
        data: { ...createFarmDto, isActive: createFarmDto.isActive ?? true },
      });
      return farm;
    } catch (error) {
      this.logger.debug(
        `Erro ao criar fazenda: ${JSON.stringify(createFarmDto)}`,
        error,
      );
      return null;
    }
  }

  async findAll(queryParams: OmitProduceIdFarmsQueryDto): Promise<Farm[]> {
    const query: Prisma.FarmFindManyArgs = {
      orderBy: { createdAt: 'desc' },
    };
    if (typeof queryParams.isActive === 'boolean') {
      query.where = { isActive: queryParams.isActive };
    }
    if (queryParams.state) {
      query.where = {
        ...query.where,
        state: queryParams.state,
      };
    }

    return await this.prismaService.farm.findMany(query);
  }

  async findOne(id: string): Promise<Farm | null> {
    const farm = await this.prismaService.farm.findUnique({
      where: { id, isActive: true },
    });
    if (!farm) {
      this.logger.debug(`Fazenda com ID ${id} não encontrada ou inativa.`);
      return null;
    }

    return farm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm | null> {
    const farm = await this.prismaService.farm.update({
      where: { id },
      data: { ...updateFarmDto, isActive: updateFarmDto.isActive ?? true },
    });
    if (!farm) {
      this.logger.debug(
        `Fazenda com ID ${id} não encontrada para atualização.`,
      );
      return null;
    }

    return farm;
  }

  async remove(id: string): Promise<Farm | null> {
    const farm = await this.prismaService.farm.update({
      where: { id },
      data: { isActive: false },
    });
    if (!farm) {
      this.logger.debug(`Fazenda com ID ${id} não encontrada para remoção.`);
      return null;
    }

    return farm;
  }

  async findByRuralProducerId(
    producerId: string,
    queryParams: OmitProduceIdFarmsQueryDto,
  ): Promise<Farm[]> {
    const query: Prisma.FarmFindManyArgs = {
      where: { producerId },
      orderBy: { createdAt: 'desc' },
    };
    if (typeof queryParams.isActive === 'boolean') {
      query.where = {
        ...query.where,
        isActive: queryParams.isActive,
      };
    }
    if (queryParams.state) {
      query.where = {
        ...query.where,
        state: queryParams.state,
      };
    }

    return await this.prismaService.farm.findMany(query);
  }

  async farmDashboardTotals(queryParams: FarmQueryParamsDto): Promise<{
    totalFarms: number;
    totalArea: number;
  }> {
    const query: Prisma.FarmWhereInput = {};
    if (queryParams.producerId) {
      query.producerId = queryParams.producerId;
    }
    if (typeof queryParams.isActive === 'boolean') {
      query.isActive = queryParams.isActive;
    }
    if (queryParams.state) {
      query.state = queryParams.state;
    }

    const [totalFarmsResult, totalAreaResult] = await Promise.all([
      this.prismaService.farm.count({
        where: query,
      }),
      this.prismaService.farm.aggregate({
        where: query,
        _sum: { totalAreaInHectares: true },
      }),
    ]);

    return {
      totalFarms: totalFarmsResult,
      totalArea: totalAreaResult._sum.totalAreaInHectares || 0,
    };
  }

  async farmDashboardAggregateStates(
    queryParams: FarmQueryParamsDto,
  ): Promise<{ state: string; totalFarms: number }[]> {
    const query: Prisma.FarmGroupByArgs = {
      by: ['state'],
      _count: {
        _all: true,
      },
    };
    if (queryParams.producerId) {
      query.where = {
        producerId: queryParams.producerId,
      };
    }
    if (typeof queryParams.isActive === 'boolean') {
      query.where = {
        ...query.where,
        isActive: queryParams.isActive,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = await this.prismaService.farm.groupBy({ ...query } as any);

    return result.map(({ state, ...rest }) => {
      const { _all } = (rest._count as { _all: number }) ?? { _all: 0 };
      return {
        state: state,
        totalFarms: _all,
      };
    });
  }
}
