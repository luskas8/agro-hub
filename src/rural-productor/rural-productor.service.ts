import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRuralProductorDto } from './dto/create-rural-productor.dto';
import { UpdateRuralProductorDto } from './dto/update-rural-productor.dto';

@Injectable()
export class RuralProductorService {
  private readonly logger = new Logger(RuralProductorService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createRuralProductorDto: CreateRuralProductorDto,
  ): Promise<Prisma.RuralProductorCreateInput> {
    this.logger.debug('Saving rural productor data');
    const data = await this.prismaService.ruralProductor.create({
      data: createRuralProductorDto,
    });
    console.log(typeof data);
    return data;
  }

  async findAll(): Promise<Prisma.RuralProductorCreateInput[]> {
    return await this.prismaService.ruralProductor.findMany({
      where: {
        isActive: true,
      },
    });
  }

  findOne(id: string): Promise<Prisma.RuralProductorCreateInput | null> {
    return this.prismaService.ruralProductor.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    dto: UpdateRuralProductorDto,
  ): Promise<Prisma.RuralProductorUpdateInput> {
    const data = UpdateRuralProductorDto.toPrisma(dto);
    const respult = await this.prismaService.ruralProductor.update({
      where: { id },
      data: { ...data },
    });
    return UpdateRuralProductorDto.toPrisma(respult);
  }

  async remove(id: string): Promise<Prisma.RuralProductorUpdateInput> {
    const data = UpdateRuralProductorDto.toPrisma({
      isActive: false,
    });
    return await this.prismaService.ruralProductor.update({
      where: { id },
      data: { ...data },
    });
  }
}
