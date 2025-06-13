import { PrismaService } from '@app-prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { RuralProducer } from '@prisma/client';
import { CreateRuralProducerDto } from './dto/create-rural-producer.dto';
import { UpdateRuralProducerDto } from './dto/update-rural-producer.dto';

@Injectable()
export class RuralProducerService {
  private readonly logger = new Logger(RuralProducerService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createRuralProducerDto: CreateRuralProducerDto,
  ): Promise<RuralProducer> {
    this.logger.debug('Saving rural productor data');
    const data = await this.prismaService.ruralProducer.create({
      data: createRuralProducerDto,
    });
    return data;
  }

  async findAll(): Promise<RuralProducer[]> {
    return await this.prismaService.ruralProducer.findMany({
      where: {
        isActive: true,
      },
    });
  }

  async findOne(id: string): Promise<RuralProducer | null> {
    return await this.prismaService.ruralProducer.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    dto: UpdateRuralProducerDto,
  ): Promise<RuralProducer | null> {
    const data = UpdateRuralProducerDto.toPrisma(dto);
    const respult = await this.prismaService.ruralProducer.update({
      where: { id },
      data: { ...data },
    });
    return respult;
  }

  async remove(id: string): Promise<RuralProducer> {
    const data = UpdateRuralProducerDto.toPrisma({
      isActive: false,
    });
    return await this.prismaService.ruralProducer.update({
      where: { id },
      data: { ...data },
    });
  }
}
