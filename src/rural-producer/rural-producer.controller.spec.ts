/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '../prisma/generated/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRuralProducerDto } from './dto/create-rural-producer.dto';
import { UpdateRuralProducerDto } from './dto/update-rural-producer.dto';
import { RuralProducerController } from './rural-producer.controller';
import { RuralProducerService } from './rural-producer.service';
import { NotFoundException } from '@nestjs/common';

const MOCK_DATE = new Date('2025-01-01T10:00:00Z');

describe('RuralProducerController', () => {
  let controller: RuralProducerController;
  let service: RuralProducerService;

  const input: CreateRuralProducerDto = {
    documentType: 'cpf',
    documentNumber: '12345678900',
    name: 'John Doe',
    isActive: true,
  };

  const created: Prisma.RuralProducerCreateInput = {
    ...input,
    id: 'some-uuid',
    isActive: true,
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
    properties: undefined,
  };

  const update: UpdateRuralProducerDto = {
    name: 'Updated Name',
  };

  const updated = {
    ...created,
    ...update,
  };

  const deleted = {
    ...created,
    isActive: false,
  };

  beforeEach(async () => {
    const mockRuralProducerService = {
      create: jest.fn().mockResolvedValue(created),
      findAll: jest.fn().mockResolvedValue([created]),
      findOne: jest.fn().mockResolvedValue(created),
      update: jest.fn().mockResolvedValue(updated),
      remove: jest.fn().mockResolvedValue(deleted),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RuralProducerService,
          useValue: mockRuralProducerService,
        },
        {
          provide: PrismaService,
          useValue: {
            RuralProducer: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
      controllers: [RuralProducerController],
    }).compile();

    controller = module.get<RuralProducerController>(RuralProducerController);
    service = module.get<RuralProducerService>(RuralProducerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a rural productor', async () => {
      const result = await controller.create(input);
      expect(result).toEqual(created);
      expect(service.create).toHaveBeenCalledWith(input);
    });
  });

  describe('findAll', () => {
    it('should return an array of rural productors', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([created]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a rural productor by ID', async () => {
      const result = await controller.findOne(created.id as string);
      expect(result).toEqual(created);
      expect(service.findOne).toHaveBeenCalledWith(created.id);
    });

    it('should throw NotFoundException if rural productor not found', async () => {
      // Mock the findOne method of the service to return null for this specific test
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      await expect(controller.findOne('non-existent-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a rural productor', async () => {
      const result = await controller.update(created.id as string, update);
      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(created.id, update);
    });
  });

  describe('remove', () => {
    it('should remove a rural productor', async () => {
      const result = await controller.remove(created.id as string);
      expect(result).toEqual(deleted);
      expect(service.remove).toHaveBeenCalledWith(created.id);
    });
  });
});
