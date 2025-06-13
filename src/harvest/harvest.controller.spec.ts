import { PrismaService } from '@app-prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cultivation, Farm, Harvest } from '@prisma/client';
import { FarmService } from '@src/farm/farm.service';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';

describe('HarvestController', () => {
  let controller: HarvestController;
  let service: HarvestService;
  let farmService: FarmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestController],
      providers: [HarvestService, FarmService, PrismaService],
    }).compile();

    controller = module.get<HarvestController>(HarvestController);
    service = module.get<HarvestService>(HarvestService);
    farmService = module.get<FarmService>(FarmService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a harvest', async () => {
      const dto = { farmId: 'farm-id', harvestYear: 2023 };
      jest
        .spyOn(farmService, 'findOne')
        .mockResolvedValue({ id: 'farm-id' } as Farm);
      jest.spyOn(service, 'isDuplicate').mockResolvedValue(null);
      jest
        .spyOn(service, 'create')
        .mockResolvedValue({ id: 'harvest-id', ...dto } as unknown as Harvest);

      const result = await controller.create(dto);
      expect(result).toEqual({ id: 'harvest-id', ...dto });
    });

    it('should throw BadRequestException if farm not found', async () => {
      const dto = { farmId: 'farm-id', harvestYear: 2023 };
      jest.spyOn(farmService, 'findOne').mockResolvedValue(null);

      await expect(controller.create(dto)).rejects.toThrowError(
        'Farm not found',
      );
    });

    it('should throw BadRequestException for duplicate harvest year', async () => {
      const dto = { farmId: 'farm-id', harvestYear: 2023 };
      jest
        .spyOn(farmService, 'findOne')
        .mockResolvedValue({ id: 'farm-id' } as Farm);
      jest
        .spyOn(service, 'isDuplicate')
        .mockResolvedValue({ id: 'harvest-id' } as Harvest);

      await expect(controller.create(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on creation failure', async () => {
      const dto = { farmId: 'farm-id', harvestYear: 2023 };
      jest
        .spyOn(farmService, 'findOne')
        .mockResolvedValue({ id: 'farm-id' } as Farm);
      jest.spyOn(service, 'isDuplicate').mockResolvedValue(null);
      jest.spyOn(service, 'create').mockResolvedValue(null);

      await expect(controller.create(dto)).rejects.toThrowError(
        'Failed to create harvest',
      );
    });
  });

  describe('findByFarmId', () => {
    it('should return harvests for a given farmId', async () => {
      const farmId = 'farm-id';
      const harvests = [
        { id: 'harvest-id', farmId, harvestYear: 2023 },
      ] as unknown as Harvest[];
      jest.spyOn(service, 'findByFarmId').mockResolvedValue(harvests);

      const result = await controller.findByFarmId(farmId);
      expect(result).toEqual(harvests);
    });
  });

  describe('findOne', () => {
    const id = 'harvest-id';
    it('should return a harvest by id', async () => {
      const harvest = {
        id,
        farmId: 'farm-id',
        harvestYear: 2023,
      } as unknown as Harvest;
      jest.spyOn(service, 'findOne').mockResolvedValue(harvest);

      const result = await controller.findOne(id);
      expect(result).toEqual(harvest);
    });

    it('should throw NotFoundException if harvest not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne(id)).rejects.toThrowError(
        'Harvest not found',
      );
    });
  });

  describe('addCultivation', () => {
    const id = 'harvest-id';
    const dto = { name: 'Milho' };

    it('should add cultivation to a harvest', async () => {
      const harvest = {
        id,
        farmId: 'farm-id',
        harvestYear: 2023,
      } as unknown as Harvest;
      jest.spyOn(service, 'findOne').mockResolvedValue(harvest);
      jest
        .spyOn(service, 'addCultivation')
        .mockResolvedValue({ id: 1, ...dto } as unknown as Cultivation);

      const result = await controller.addCultivation(id, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should throw NotFoundException if harvest not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.addCultivation(id, dto)).rejects.toThrowError(
        'Harvest not found',
      );
    });

    it('should throw InternalServerErrorException on cultivation addition failure', async () => {
      const harvest = {
        id,
        farmId: 'farm-id',
        harvestYear: 2023,
      } as unknown as Harvest;
      jest.spyOn(service, 'findOne').mockResolvedValue(harvest);
      jest.spyOn(service, 'addCultivation').mockResolvedValue(null);

      await expect(controller.addCultivation(id, dto)).rejects.toThrowError(
        'Failed to add cultivation',
      );
    });
  });
});
