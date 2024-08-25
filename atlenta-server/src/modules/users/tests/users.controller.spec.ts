import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UsersController } from '../users.controllers';
import { UsersService } from '../users.services';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    getUserById: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user-id',
    },
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserById', () => {
    it('should call UsersService.getUserById with correct user ID', async () => {
      const userId = mockRequest.user['id'];
      const mockResponse = {
        data: {
          user: {
            id: userId,
            email: 'test@example.com',
          },
        },
        status: 'success',
      };

      mockUsersService.getUserById.mockResolvedValueOnce(mockResponse);

      const result = await controller.getUserById(mockRequest);

      expect(service.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResponse);
    });
  });
});
