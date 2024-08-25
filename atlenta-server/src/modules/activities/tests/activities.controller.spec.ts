import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesController } from '../activities.controllers';
import { ActivitiesService } from '../activities.services';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { AddActivityDto } from '../dto';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;
  let activitiesService: ActivitiesService;

  const mockActivitiesService = {
    addActivity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: mockActivitiesService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addActivity', () => {
    it('should call activitiesService.addActivity with the provided DTO', async () => {
      const dto: AddActivityDto = {
        description: 'Test activity',
        project_id: 'project123',
      };

      const expectedResult = { status: 'success' };
      mockActivitiesService.addActivity.mockResolvedValue(expectedResult);

      const result = await controller.addActivity(dto);

      expect(activitiesService.addActivity).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if activitiesService.addActivity throws', async () => {
      const dto: AddActivityDto = {
        description: 'Test activity',
        project_id: 'project123',
      };

      const error = new Error('Test error');
      mockActivitiesService.addActivity.mockRejectedValue(error);

      await expect(controller.addActivity(dto)).rejects.toThrow('Test error');
    });
  });
});
