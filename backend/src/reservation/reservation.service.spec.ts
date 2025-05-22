import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let prisma: PrismaService;

  const mockPrismaService = {
    reservation: {
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    concert: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((actions) => Promise.all(actions)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reserve a seat', async () => {
    const dto = { userId: 'user1', concertId: 'concert1' };
    const mockResult = { id: 'res1', ...dto };

    // Mock reservation ยังไม่เคยมี
    mockPrismaService.reservation.findFirst.mockResolvedValue(null);

    // Mock concert มีที่นั่งพอ
    mockPrismaService.concert.findUnique.mockResolvedValue({
      id: dto.concertId,
      name: 'Test Concert',
      availableSeats: 10,
    });

    //  Mock concert.update (ไม่ต้องสนใจผลลัพธ์ใน test นี้)
    mockPrismaService.concert.update.mockResolvedValue({});

    // Mock reservation.create return mockResult
    mockPrismaService.reservation.create.mockResolvedValue(mockResult);

    // Mock $transaction ให้คืนค่าทั้งสองฟังก์ชัน
    mockPrismaService.$transaction.mockImplementation(async (actions) => {
      const results = await Promise.all(actions);
      return results;
    });

    // 🔍 Execute
    const result = await service.reserve(dto.userId, dto.concertId);

    // ตรวจผล
    expect(result).toEqual(mockResult);

    expect(mockPrismaService.reservation.create).toHaveBeenCalledWith({
      data: dto,
    });

    expect(mockPrismaService.concert.update).toHaveBeenCalledWith({
      where: { id: dto.concertId },
      data: { availableSeats: { decrement: 1 } },
    });
  });

  it('should throw if reservation not found', async () => {
    mockPrismaService.reservation.findFirst.mockResolvedValue(null);

    await expect(service.cancel('user1', 'concert1')).rejects.toThrow(
      'Reservation not found',
    );
  });

  it('should cancel a reservation', async () => {
    const mockReservation = {
      id: 'res1',
      userId: 'user1',
      concertId: 'concert1',
    };

    mockPrismaService.reservation.findFirst.mockResolvedValue(mockReservation);
    mockPrismaService.reservation.delete.mockResolvedValue(mockReservation);
    mockPrismaService.concert.update.mockResolvedValue({});

    // ✅ แก้ตรงนี้: จำลองเรียก operations จริง
    mockPrismaService.$transaction.mockImplementation(async (operations) => {
      const results = [];
      for (const op of operations) {
        results.push(await op); // ✅ สำคัญตรงนี้
      }
      return results;
    });

    const result = await service.cancel(
      mockReservation.userId,
      mockReservation.concertId,
    );

    expect(result).toEqual(mockReservation);
    expect(mockPrismaService.reservation.delete).toHaveBeenCalledWith({
      where: { id: mockReservation.id },
    });
  });

  it('should return reservation history', async () => {
    const userId = 'user1';
    const mockResult = [
      { id: 'res1', userId, concertId: 'concert1' },
      { id: 'res2', userId, concertId: 'concert2' },
    ];

    mockPrismaService.reservation.findMany.mockResolvedValue(mockResult);

    const result = await service.history(userId);
    expect(result).toEqual(mockResult);
    expect(mockPrismaService.reservation.findMany).toHaveBeenCalledWith({
      where: { userId },
    });
  });
});
