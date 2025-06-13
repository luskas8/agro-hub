import { PrismaService } from '@app-prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Cultivation, Harvest, Prisma } from '@prisma/client';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { CreateHarvestCultivationDto } from './dto/create-harvest-cultivation.dto';

@Injectable()
export class HarvestService {
  constructor(private readonly prismaService: PrismaService) {}

  async isDuplicate(farmId: string, harvestYear: number): Promise<boolean> {
    const farm = await this.prismaService.harvest.findFirst({
      select: {
        id: true,
      },
      where: {
        farmId: farmId,
        harverstYear: harvestYear,
      },
    });

    if (farm) {
      return true;
    }
    return false;
  }

  async create(dto: CreateHarvestDto): Promise<Harvest | null> {
    const harvest = await this.prismaService.harvest.create({
      data: {
        farmId: dto.farmId,
        harverstYear: dto.harvestYear,
      },
    });
    if (!harvest) {
      return null;
    }

    return harvest;
  }

  async findByFarmId(farmId: string): Promise<Harvest[]> {
    const query: Prisma.HarvestFindManyArgs = {
      where: {
        farmId: farmId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    return this.prismaService.harvest.findMany(query);
  }

  async findOne(id: string): Promise<Harvest | null> {
    const harvest = await this.prismaService.harvest.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        farmId: true,
        harverstYear: true,
        createdAt: true,
        updatedAt: true,
        cultivation: true,
      },
    });

    if (!harvest) {
      return null;
    }

    return harvest;
  }

  async addCultivation(
    id: string,
    dto: CreateHarvestCultivationDto,
  ): Promise<Cultivation | null> {
    const cultivation = await this.prismaService.cultivation.create({
      data: {
        name: dto.name,
        harvestId: id,
      },
    });
    if (!cultivation) {
      return null;
    }

    return cultivation;
  }
}
