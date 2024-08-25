import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.services';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { handleCustomException } from '../../../utils/helpers';

jest.mock('../../../utils/helpers', () => ({
  handleCustomException: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const mockUser = { id: '1', email, name: 'Test User' };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await service.findByEmail(email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      const email = 'notfound@example.com';

      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      const result = await service.findByEmail(email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should retrieve a user by ID with related projects', async () => {
      const userId = 'user-id';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        projects: [
          {
            id: 'project-id',
            name: 'Test Project',
            activities: [],
            admin: {},
            members: [],
            tasks: [],
          },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await service.getUserById(userId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: {
          projects: {
            include: {
              activities: true,
              admin: true,
              members: true,
              tasks: true,
            },
          },
        },
      });
      expect(result).toEqual({
        data: { user: { ...mockUser, password: undefined } },
        status: 'success',
      });
    });

    it('should handle exceptions and call handleCustomException', async () => {
      const userId = 'user-id';
      const error = new Error('Database error');

      mockPrismaService.user.findUnique.mockRejectedValueOnce(error);

      const result = await service.getUserById(userId);

      expect(handleCustomException).toHaveBeenCalledWith({
        error,
        displayMessage: 'Something went wrong, please try again.',
      });
      expect(result).toBeUndefined();
    });
  });
});
