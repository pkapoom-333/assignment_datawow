import { Test, TestingModule } from '@nestjs/testing';
import { ConcertService } from './concert.service';
import { PrismaService } from '../prisma.service';

describe('ConcertService', () => {
    let service: ConcertService;
    let prisma: PrismaService;
  
    const mockPrismaService = {
      concert: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ConcertService,
          {
            provide: PrismaService,
            useValue: mockPrismaService,
          },
        ],
      }).compile();
  
      service = module.get<ConcertService>(ConcertService);
      prisma = module.get<PrismaService>(PrismaService);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    it('should create a concert', async () => {
      const dto = {
        name: 'Test Concert',
        description: 'Test Desc',
        totalSeats: 100,
        availableSeats: 100,
      };
      mockPrismaService.concert.create.mockResolvedValue(dto);
  
      const result = await service.create(dto);
      expect(result).toEqual(dto);
      expect(mockPrismaService.concert.create).toHaveBeenCalledWith({ data: dto });
    });
  });