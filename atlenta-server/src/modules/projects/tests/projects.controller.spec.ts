import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '../projects.controllers';
import { ProjectsService } from '../projects.services';
import { JwtGuard } from '../../../modules/auth/guard';
import { CreateProjectDto } from '../dto';
import { mockRequest } from 'jest-mock-req-res';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let projectsService: ProjectsService;

  const mockProjectsService = {
    createProject: jest.fn(),
    deleteProject: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProject', () => {
    it('should call projectsService.createProject with userId and dto', async () => {
      const createProjectDto: CreateProjectDto = { name: 'New Project' };
      const req = mockRequest({
        user: { id: 'user1' },
      });
      const expectedResult = {
        data: { project: { id: '1', name: 'New Project' } },
        status: 'success',
        displayMessage: 'Project created successfully',
      };

      mockProjectsService.createProject.mockResolvedValue(expectedResult);

      const result = await controller.createProject(createProjectDto, req);

      expect(projectsService.createProject).toHaveBeenCalledWith(
        'user1',
        createProjectDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from projectsService.createProject', async () => {
      const createProjectDto: CreateProjectDto = { name: 'New Project' };
      const req = mockRequest({
        user: { id: 'user1' },
      });
      const expectedError = new Error('Creation failed');

      mockProjectsService.createProject.mockRejectedValue(expectedError);

      await expect(
        controller.createProject(createProjectDto, req),
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('deleteProject', () => {
    it('should call projectsService.deleteProject with userId and projectId', async () => {
      const req = mockRequest({
        user: { id: 'user1' },
      });
      const projectId = 'project1';
      const expectedResult = {
        data: { projects: [{ id: '2', name: 'Project 2' }] },
        status: 'success',
        displayMessage: 'Project deleted successfully',
      };

      mockProjectsService.deleteProject.mockResolvedValue(expectedResult);

      const result = await controller.deleteProject(req, projectId);

      expect(projectsService.deleteProject).toHaveBeenCalledWith(
        'user1',
        projectId,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from projectsService.deleteProject', async () => {
      const req = mockRequest({
        user: { id: 'user1' },
      });
      const projectId = 'project1';
      const expectedError = new Error('Deletion failed');

      mockProjectsService.deleteProject.mockRejectedValue(expectedError);

      await expect(controller.deleteProject(req, projectId)).rejects.toThrow(
        'Deletion failed',
      );
    });
  });
});
