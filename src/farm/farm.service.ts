import { PrismaService } from '@app-prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Farm } from '@prisma/client';
import { CreateFarmDto } from './dto/create-farm.dto';
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

  async findAll(): Promise<Farm[]> {
    return await this.prismaService.farm.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
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

  async findByRuralProducerId(producerId: string): Promise<Farm[]> {
    return await this.prismaService.farm.findMany({
      where: { producerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async farmDashboardTotals(): Promise<{
    totalFarms: number;
    totalArea: number;
  }> {
    const [totalFarmsResult, totalAreaResult] = await Promise.all([
      this.prismaService.farm.count(),
      this.prismaService.farm.aggregate({
        _sum: { totalAreaInHectares: true },
      }),
    ]);

    return {
      totalFarms: totalFarmsResult,
      totalArea: totalAreaResult._sum.totalAreaInHectares || 0,
    };
  }

  async farmDashboardAggregateStates(): Promise<
    { state: string; totalFarms: number }[]
  > {
    const result = await this.prismaService.farm.groupBy({
      by: ['state'],
      _count: {
        _all: true,
      },
    });

    return result.map(({ state, _count: { _all } }) => ({
      state: state,
      totalFarms: _all,
    }));
  }
}
