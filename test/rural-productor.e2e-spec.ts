import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { UpdateRuralProducerDto } from 'src/rural-producer/dto/update-rural-producer.dto';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateRuralProducerDto } from '../src/rural-producer/dto/create-rural-producer.dto';
import { RuralProducerService } from '../src/rural-producer/rural-producer.service';

describe('RuralProducerController (e2e)', () => {
  let app: INestApplication<App>;
  const baseUrl = '/rural-producer';
  let RuralProducerService: RuralProducerService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    RuralProducerService = app.get<RuralProducerService>(
      RuralProducerService,
    );
  });

  it('should create a rural productor', async () => {
    const createRuralProducerDto: CreateRuralProducerDto = {
      documentNumber: '12345678901',
      name: 'John Doe',
      documentType: 'cpf',
      isActive: true,
    };

    const mockRuralProducer: Prisma.RuralProducerCreateInput = {
      id: 'some-uuid',
      ...createRuralProducerDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(RuralProducerService, 'create')
      .mockResolvedValue(mockRuralProducer);

    return request(app.getHttpServer())
      .post(baseUrl)
      .send(createRuralProducerDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('id');
      });
  });

  it('should return 400 if document number is invalid', async () => {
    const invalidRuralProducerDto: CreateRuralProducerDto = {
      documentNumber: 'invalid-document',
      name: 'Invalid User',
      documentType: 'cpf',
      isActive: true,
    };
    return request(app.getHttpServer())
      .post(baseUrl)
      .send(invalidRuralProducerDto)
      .expect(400)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('message');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.message).toEqual('Tipo de documento inválido.');
      });
  });

  it('should get all rural productors', async () => {
    return request(app.getHttpServer())
      .get(baseUrl)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('should get a rural productor by id', async () => {
    // GIVEN
    const createRuralProducerDto: CreateRuralProducerDto = {
      documentNumber: '98765432109',
      name: 'Jane Doe',
      documentType: 'cpf',
      isActive: true,
    };

    const mockRuralProducer: Prisma.RuralProducerCreateInput = {
      id: randomUUID(),
      ...createRuralProducerDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(RuralProducerService, 'create')
      .mockResolvedValue(mockRuralProducer);

    const createResponse = await request(app.getHttpServer())
      .post(baseUrl)
      .send(createRuralProducerDto);

    const { id } = createResponse.body as { id: string };

    // WHEN
    jest
      .spyOn(RuralProducerService, 'findOne')
      .mockResolvedValue(mockRuralProducer);

    // THEN
    return request(app.getHttpServer())
      .get(`${baseUrl}/${id}`)
      .expect(200)
      .expect(
        (res: {
          body: { id: string; documentNumber: string; name: string };
        }) => {
          expect(res.body).toBeDefined();
          expect(res.body.id).toEqual(id);
          expect(res.body.documentNumber).toEqual(
            createRuralProducerDto.documentNumber,
          );
          expect(res.body.name).toEqual(createRuralProducerDto.name);
        },
      );
  });

  it('should return 404 if rural productor is not found', async () => {
    const nonExistingId = randomUUID();
    return request(app.getHttpServer())
      .get(`${baseUrl}/${nonExistingId}`)
      .expect(404)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.message).toEqual(
          `Rural productor with ID: ${nonExistingId} not found`,
        );
      });
  });

  it('should update a rural productor', async () => {
    // GIVEN
    const createRuralProducerDto: CreateRuralProducerDto = {
      documentNumber: '11223344556',
      name: 'Original Name',
      documentType: 'cpf',
      isActive: true,
    };

    const mockRuralProducer: Prisma.RuralProducerCreateInput = {
      id: randomUUID(),
      ...createRuralProducerDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(RuralProducerService, 'create')
      .mockResolvedValue(mockRuralProducer);

    const createResponse = await request(app.getHttpServer())
      .post(baseUrl)
      .send(createRuralProducerDto);

    const { id } = createResponse.body as { id: string };

    // THEN
    const updateRuralProducerDto: UpdateRuralProducerDto = {
      name: 'Updated Name',
    };

    const mockUpdatedRuralProducer: Prisma.RuralProducerCreateInput = {
      id,
      documentNumber: createRuralProducerDto.documentNumber,
      documentType: createRuralProducerDto.documentType,
      isActive: createRuralProducerDto.isActive,
      name: 'Updated Name',
      createdAt: new Date(),
      updatedAt: new Date(),
      properties: undefined,
    };

    jest
      .spyOn(RuralProducerService, 'update')
      .mockResolvedValue(mockUpdatedRuralProducer);

    return request(app.getHttpServer())
      .patch(`${baseUrl}/${id}`)
      .send(updateRuralProducerDto)
      .expect(200)
      .expect((res: { body: { name: string } }) => {
        expect(res.body).toBeDefined();
        expect(res.body.name).toEqual(updateRuralProducerDto.name);
      });
  });

  it('should delete a rural productor', async () => {
    // GIVEN
    const createRuralProducerDto: CreateRuralProducerDto = {
      documentNumber: '66554433221',
      name: 'To be deleted',
      documentType: 'cpf',
      isActive: true,
    };

    const mockRuralProducer: Prisma.RuralProducerCreateInput = {
      id: randomUUID(),
      ...createRuralProducerDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(RuralProducerService, 'create')
      .mockResolvedValue(mockRuralProducer);

    await request(app.getHttpServer())
      .post(baseUrl)
      .send(createRuralProducerDto);

    const id = mockRuralProducer.id!;

    const mockDeletedRuralProducer: Prisma.RuralProducerCreateInput = {
      ...mockRuralProducer,
      isActive: false,
      updatedAt: new Date(),
    };

    // WHEN
    jest
      .spyOn(RuralProducerService, 'remove')
      .mockResolvedValue(mockDeletedRuralProducer);

    // THEN
    return request(app.getHttpServer()).delete(`${baseUrl}/${id}`).expect(200);
  });
});
