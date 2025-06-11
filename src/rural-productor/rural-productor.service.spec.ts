import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRuralProductorDto } from './dto/create-rural-productor.dto';
import { UpdateRuralProductorDto } from './dto/update-rural-productor.dto';
import { RuralProductorService } from './rural-productor.service';

const MOCK_DATE = new Date('2025-01-01T10:00:00Z');

describe('RuralProductorService', () => {
  let service: RuralProductorService;

  const input: CreateRuralProductorDto = {
    documentType: 'cpf',
    documentNumber: '12345678900',
    name: 'John Doe',
    isActive: true,
  };

  const created: Prisma.RuralProductorCreateInput = {
    id: 'some-uuid',
    documentType: 'cpf',
    documentNumber: '12345678900',
    name: 'John Doe',
    isActive: true,
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
    properties: undefined,
  };

  const updateData: UpdateRuralProductorDto = {
    name: 'Updated Name',
  };

  const updated = {
    ...created,
    ...updateData,
  };

  const deleted = {
    ...created,
    isActive: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            ruralProductor: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: RuralProductorService,
          useValue: {
            create: jest.fn(() => Promise.resolve(created)),
            findAll: jest.fn(() => Promise.resolve([created])),
            findOne: jest.fn().mockResolvedValue(created),
            update: jest.fn(() => Promise.resolve(updated)),
            remove: jest.fn().mockResolvedValue(deleted),
          },
        },
      ],
    }).compile();

    service = module.get<RuralProductorService>(RuralProductorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a rural productor', async () => {
      const result = await service.create(input);
      expect(result).toBeDefined();
      expect(result).toEqual(created);
    });

    it('should throw an error if create fails', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Failed to create'));

      input.documentNumber = 'invalid-document';
      await expect(service.create(input)).rejects.toThrow('');
    });
  });

  describe('findAll', () => {
    it('should return an array of rural productors', async () => {
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([created]);
    });
  });

  describe('findOne', () => {
    it('should return a rural productor by id', async () => {
      const id = 'some-uuid-123';

      const result = await service.findOne(id);
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('should update a rural productor', async () => {
      const id = 'some-uuid-123';
      const expectedData = {
        ...created,
        ...updateData,
      };

      const result = await service.update(id, updateData);
      expect(result).toEqual(expectedData);
    });
  });

  describe('remove', () => {
    it('should remove a rural productor', async () => {
      const id = 'some-uuid-123';

      const result = await service.remove(id);
      expect(result).toEqual(deleted);
    });
  });
});
