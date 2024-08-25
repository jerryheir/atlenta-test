import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '../projects.services';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { CreateProjectDto } from '../dto';
import * as helpers from '../../../utils/helpers';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    project: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProjects', () => {
    it('should return all projects for a user', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }];
      mockPrismaService.project.findMany.mockResolvedValue(mockProjects);

      const result = await service.getAllProjects('user1');

      expect(result).toEqual(mockProjects);
      expect(prismaService.project.findMany).toHaveBeenCalledWith({
        where: {
          members: {
            some: {
              id: 'user1',
            },
          },
        },
        include: {
          admin: true,
          members: true,
          tasks: {
            include: {
              comments: true,
            },
          },
          activities: true,
        },
      });
    });

    it('should handle errors', async () => {
      const mockError = new Error('Database error');
      mockPrismaService.project.findMany.mockRejectedValue(mockError);

      const handleCustomExceptionSpy = jest.spyOn(
        helpers,
        'handleCustomException',
      );

      try {
        await service.getAllProjects('user1');
      } catch (error) {
        expect(handleCustomExceptionSpy).toHaveBeenCalledWith({
          error,
          displayMessage: 'Something went wrong, please try again.',
        });
      }
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const dto: CreateProjectDto = { name: 'New Project' };
      const mockProject = { id: '1', ...dto };
      mockPrismaService.project.create.mockResolvedValue(mockProject);

      const result = await service.createProject('user1', dto);

      expect(result).toEqual({
        data: { project: mockProject },
        status: 'success',
        displayMessage: 'Project created successfully',
      });
      expect(prismaService.project.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          admin: {
            connect: { id: 'user1' },
          },
          members: { connect: { id: 'user1' } },
        },
        include: {
          admin: true,
          members: true,
          tasks: true,
          activities: true,
        },
      });
    });

    it('should handle errors', async () => {
      const dto: CreateProjectDto = { name: 'New Project' };
      const mockError = new Error('Database error');
      mockPrismaService.project.create.mockRejectedValue(mockError);

      const handleCustomExceptionSpy = jest.spyOn(
        helpers,
        'handleCustomException',
      );

      try {
        await service.createProject('user1', dto);
      } catch (error) {
        expect(handleCustomExceptionSpy).toHaveBeenCalledWith({
          error,
          displayMessage: 'Something went wrong, please try again.',
        });
      }
    });
  });

  describe('deleteProject', () => {
    it('should delete a project and return updated projects list', async () => {
      const mockProjects = [{ id: '2', name: 'Project 2' }];
      mockPrismaService.project.delete.mockResolvedValue({
        id: '1',
        name: 'Deleted Project',
      });
      mockPrismaService.project.findMany.mockResolvedValue(mockProjects);

      const result = await service.deleteProject('user1', 'project1');

      expect(result).toEqual({
        data: { projects: mockProjects },
        status: 'success',
        displayMessage: 'Project deleted successfully',
      });
      expect(prismaService.project.delete).toHaveBeenCalledWith({
        where: { id: 'project1' },
      });
    });

    it('should handle errors', async () => {
      const mockError = new Error('Database error');
      mockPrismaService.project.delete.mockRejectedValue(mockError);

      const handleCustomExceptionSpy = jest.spyOn(
        helpers,
        'handleCustomException',
      );

      try {
        await service.deleteProject('user1', 'project1');
      } catch (error) {
        expect(handleCustomExceptionSpy).toHaveBeenCalledWith({
          error,
          displayMessage: 'Something went wrong, please try again.',
        });
      }
    });
  });
});
