import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { UpdateRuralProductorDto } from 'src/rural-productor/dto/update-rural-productor.dto';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateRuralProductorDto } from '../src/rural-productor/dto/create-rural-productor.dto';
import { RuralProductorService } from '../src/rural-productor/rural-productor.service';

describe('RuralProductorController (e2e)', () => {
  let app: INestApplication<App>;
  const baseUrl = '/rural-productor';
  let ruralProductorService: RuralProductorService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    ruralProductorService = app.get<RuralProductorService>(
      RuralProductorService,
    );
  });

  it('should create a rural productor', async () => {
    const createRuralProductorDto: CreateRuralProductorDto = {
      documentNumber: '12345678901',
      name: 'John Doe',
      documentType: 'cpf',
      isActive: true,
    };

    const mockRuralProductor: Prisma.RuralProductorCreateInput = {
      id: 'some-uuid',
      ...createRuralProductorDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(ruralProductorService, 'create')
      .mockResolvedValue(mockRuralProductor);

    return request(app.getHttpServer())
      .post(baseUrl)
      .send(createRuralProductorDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('id');
      });
  });

  it('should return 400 if document number is invalid', async () => {
    const invalidRuralProductorDto: CreateRuralProductorDto = {
      documentNumber: 'invalid-document',
      name: 'Invalid User',
      documentType: 'cpf',
      isActive: true,
    };
    return request(app.getHttpServer())
      .post(baseUrl)
      .send(invalidRuralProductorDto)
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
    const createRuralProductorDto: CreateRuralProductorDto = {
      documentNumber: '98765432109',
      name: 'Jane Doe',
      documentType: 'cpf',
      isActive: true,
    };

    const mockRuralProductor: Prisma.RuralProductorCreateInput = {
      id: randomUUID(),
      ...createRuralProductorDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(ruralProductorService, 'create')
      .mockResolvedValue(mockRuralProductor);

    const createResponse = await request(app.getHttpServer())
      .post(baseUrl)
      .send(createRuralProductorDto);

    const { id } = createResponse.body as { id: string };

    // WHEN
    jest
      .spyOn(ruralProductorService, 'findOne')
      .mockResolvedValue(mockRuralProductor);

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
            createRuralProductorDto.documentNumber,
          );
          expect(res.body.name).toEqual(createRuralProductorDto.name);
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
    const createRuralProductorDto: CreateRuralProductorDto = {
      documentNumber: '11223344556',
      name: 'Original Name',
      documentType: 'cpf',
      isActive: true,
    };

    const mockRuralProductor: Prisma.RuralProductorCreateInput = {
      id: randomUUID(),
      ...createRuralProductorDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(ruralProductorService, 'create')
      .mockResolvedValue(mockRuralProductor);

    const createResponse = await request(app.getHttpServer())
      .post(baseUrl)
      .send(createRuralProductorDto);

    const { id } = createResponse.body as { id: string };

    // THEN
    const updateRuralProductorDto: UpdateRuralProductorDto = {
      name: 'Updated Name',
    };

    const mockUpdatedRuralProductor: Prisma.RuralProductorCreateInput = {
      id,
      documentNumber: createRuralProductorDto.documentNumber,
      documentType: createRuralProductorDto.documentType,
      isActive: createRuralProductorDto.isActive,
      name: 'Updated Name',
      createdAt: new Date(),
      updatedAt: new Date(),
      properties: undefined,
    };

    jest
      .spyOn(ruralProductorService, 'update')
      .mockResolvedValue(mockUpdatedRuralProductor);

    return request(app.getHttpServer())
      .patch(`${baseUrl}/${id}`)
      .send(updateRuralProductorDto)
      .expect(200)
      .expect((res: { body: { name: string } }) => {
        expect(res.body).toBeDefined();
        expect(res.body.name).toEqual(updateRuralProductorDto.name);
      });
  });

  it('should delete a rural productor', async () => {
    // GIVEN
    const createRuralProductorDto: CreateRuralProductorDto = {
      documentNumber: '66554433221',
      name: 'To be deleted',
      documentType: 'cpf',
      isActive: true,
    };

    const mockRuralProductor: Prisma.RuralProductorCreateInput = {
      id: randomUUID(),
      ...createRuralProductorDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(ruralProductorService, 'create')
      .mockResolvedValue(mockRuralProductor);

    await request(app.getHttpServer())
      .post(baseUrl)
      .send(createRuralProductorDto);

    const id = mockRuralProductor.id!;

    const mockDeletedRuralProductor: Prisma.RuralProductorCreateInput = {
      ...mockRuralProductor,
      isActive: false,
      updatedAt: new Date(),
    };

    // WHEN
    jest
      .spyOn(ruralProductorService, 'remove')
      .mockResolvedValue(mockDeletedRuralProductor);

    // THEN
    return request(app.getHttpServer()).delete(`${baseUrl}/${id}`).expect(200);
  });
});
