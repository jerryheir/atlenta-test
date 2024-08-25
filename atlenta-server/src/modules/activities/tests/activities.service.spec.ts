import { Test, TestingModule } from '@nestjs/testing';
import * as helpers from '../../../utils/helpers';
import { ActivitiesService } from '../activities.services';
import { PrismaService } from '../../prisma/prisma.service';
import { AddActivityDto } from '../dto';

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prismaService: PrismaService;

  const mockPrismaService = {
    activity: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addActivity', () => {
    it('should successfully add an activity', async () => {
      const dto: AddActivityDto = {
        description: 'Test activity',
        project_id: 'project123',
      };

      mockPrismaService.activity.create.mockResolvedValue({});

      const result = await service.addActivity(dto);

      expect(result).toEqual({ status: 'success' });
      expect(mockPrismaService.activity.create).toHaveBeenCalledWith({
        data: {
          description: dto.description,
          project: {
            connect: { id: dto.project_id },
          },
        },
      });
    });

    it('should handle errors and call handleCustomException', async () => {
      const dto: AddActivityDto = {
        description: 'Test activity',
        project_id: 'project123',
      };
      const mockError = new Error('Failed to add activity');
      (mockPrismaService.activity.create as jest.Mock).mockRejectedValue(
        mockError,
      );
      const handleCustomExceptionSpy = jest.spyOn(
        helpers,
        'handleCustomException',
      );

      try {
        await service.addActivity(dto);
      } catch (error) {
        expect(handleCustomExceptionSpy).toHaveBeenCalledWith({
          error,
        });
      }
    });
  });
});
