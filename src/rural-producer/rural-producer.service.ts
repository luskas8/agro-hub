import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRuralProducerDto } from './dto/create-rural-producer.dto';
import { UpdateRuralProducerDto } from './dto/update-rural-producer.dto';

@Injectable()
export class RuralProducerService {
  private readonly logger = new Logger(RuralProducerService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createRuralProducerDto: CreateRuralProducerDto,
  ): Promise<Prisma.RuralProducerCreateInput> {
    this.logger.debug('Saving rural productor data');
    const data = await this.prismaService.ruralProducer.create({
      data: createRuralProducerDto,
    });
    console.log(typeof data);
    return data;
  }

  async findAll(): Promise<Prisma.RuralProducerCreateInput[]> {
    return await this.prismaService.ruralProducer.findMany({
      where: {
        isActive: true,
      },
    });
  }

  findOne(id: string): Promise<Prisma.RuralProducerCreateInput | null> {
    return this.prismaService.ruralProducer.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    dto: UpdateRuralProducerDto,
  ): Promise<Prisma.RuralProducerUpdateInput> {
    const data = UpdateRuralProducerDto.toPrisma(dto);
    const respult = await this.prismaService.ruralProducer.update({
      where: { id },
      data: { ...data },
    });
    return UpdateRuralProducerDto.toPrisma(respult);
  }

  async remove(id: string): Promise<Prisma.RuralProducerUpdateInput> {
    const data = UpdateRuralProducerDto.toPrisma({
      isActive: false,
    });
    return await this.prismaService.ruralProducer.update({
      where: { id },
      data: { ...data },
    });
  }
}
