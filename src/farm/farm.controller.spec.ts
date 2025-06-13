import { PrismaService } from '@app-prisma/prisma.service';
import { BadRequestException, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Farm, RuralProducer } from '@prisma/client';
import { RuralProducerService } from '@src/rural-producer/rural-producer.service';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';

describe('FarmController', () => {
  let controller: FarmController;
  let service: FarmService;
  let ruralProducerService: RuralProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [FarmService, RuralProducerService, PrismaService],
    }).compile();

    controller = module.get<FarmController>(FarmController);
    service = module.get<FarmService>(FarmService);
    ruralProducerService =
      module.get<RuralProducerService>(RuralProducerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const input = {
      name: 'Fazenda Teste',
      city: 'Cidade Teste',
      state: 'Estado Teste',
      totalAreaInHectares: 100,
      vegetableAreaInHectares: 50,
      arableAreaInHectares: 30,
      producerId: 'UUID',
    };

    it('should create a Farm with success', async () => {
      const MOCK_DATE = new Date('2023-10-01T00:00:00Z');
      const output = {
        id: 'UUID',
        ...input,
        createdAt: MOCK_DATE,
        updatedAt: MOCK_DATE,
        isActive: true,
      };
      const producer: RuralProducer = {
        id: 'UUID',
        name: 'Produtor Teste',
        createdAt: MOCK_DATE,
        updatedAt: MOCK_DATE,
        documentNumber: '12345678910',
        documentType: 'cpf',
        isActive: true,
      };

      jest
        .spyOn(ruralProducerService, 'findOne')
        .mockImplementation(() => Promise.resolve(producer));

      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(output));

      const result = await controller.create(input);
      expect(result).toBeDefined();
      expect(result).toEqual(output);
    });

    it('should not create a farm when not find produceId', async () => {
      const wrongInput = { ...input, producerId: '' };

      jest
        .spyOn(ruralProducerService, 'findOne')
        .mockImplementation(() => Promise.resolve(null));

      await expect(controller.create(wrongInput)).rejects.toBeInstanceOf(
        HttpException,
      );
    });

    it('should throw BadRequestException when farn size use-case not pass', async () => {
      const wrongInput = {
        ...input,
        totalAreaInHectares: 50,
        vegetableAreaInHectares: 30,
        arableAreaInHectares: 30,
      };

      await expect(controller.create(wrongInput)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of Farms', async () => {
      const output: Farm[] = [
        {
          id: 'UUID1',
          name: 'Fazenda Teste 1',
          city: 'Cidade Teste 1',
          state: 'Estado Teste 1',
          totalAreaInHectares: 100,
          vegetableAreaInHectares: 50,
          arableAreaInHectares: 30,
          producerId: 'UUID',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
        },
        {
          id: 'UUID2',
          name: 'Fazenda Teste 2',
          city: 'Cidade Teste 2',
          state: 'Estado Teste 2',
          totalAreaInHectares: 200,
          vegetableAreaInHectares: 100,
          arableAreaInHectares: 60,
          producerId: 'UUID',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(output);

      const result = await controller.findAll();
      expect(result).toBeDefined();
      expect(result).toEqual(output);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a Farm by ID', async () => {
      const output: Farm = {
        id: 'UUID',
        name: 'Fazenda Teste',
        city: 'Cidade Teste',
        state: 'Estado Teste',
        totalAreaInHectares: 100,
        vegetableAreaInHectares: 50,
        arableAreaInHectares: 30,
        producerId: 'UUID',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(output);

      const result = await controller.findOne('UUID');
      expect(result).toBeDefined();
      expect(result).toEqual(output);
    });

    it('should throw NotFoundException when Farm not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('INVALID_ID')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('update', () => {
    const updateInput = {
      name: 'Fazenda Atualizada',
      city: 'Cidade Atualizada',
      state: 'Estado Atualizado',
      totalAreaInHectares: 120,
      vegetableAreaInHectares: 60,
      arableAreaInHectares: 40,
    };

    it('should update a Farm with success', async () => {
      const output: Farm = {
        id: 'UUID',
        ...updateInput,
        producerId: 'UUID',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(output);
      jest.spyOn(ruralProducerService, 'findOne').mockResolvedValue({
        id: 'UUID',
        name: 'Produtor Teste',
        createdAt: new Date(),
        updatedAt: new Date(),
        documentNumber: '12345678910',
        documentType: 'cpf',
        isActive: true,
      } as RuralProducer);

      jest.spyOn(service, 'update').mockResolvedValue(output);

      const result = await controller.update('UUID', updateInput);
      expect(result).toBeDefined();
      expect(result).toEqual(output);
    });

    it('should throw NotFoundException when Farm not found for update', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(
        controller.update('INVALID_ID', updateInput),
      ).rejects.toThrow(HttpException);
    });

    it('should throw BadRequestException when producerId does not match', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(updateInput as Farm);
      jest.spyOn(ruralProducerService, 'findOne').mockResolvedValue(null);

      await expect(
        controller.update('UUID', { ...updateInput, producerId: 'NEW_UUID' }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a Farm with success', async () => {
      const output: Farm = {
        id: 'UUID',
        name: 'Fazenda Teste',
        city: 'Cidade Teste',
        state: 'Estado Teste',
        totalAreaInHectares: 100,
        vegetableAreaInHectares: 50,
        arableAreaInHectares: 30,
        producerId: 'UUID',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(output);
      jest.spyOn(service, 'remove').mockResolvedValue(output);

      const result = await controller.remove('UUID');
      expect(result).toBeDefined();
      expect(result).toEqual(output);
    });

    it('should throw NotFoundException when Farm not found for removal', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.remove('INVALID_ID')).rejects.toThrow(
        HttpException,
      );
    });
  });
});
