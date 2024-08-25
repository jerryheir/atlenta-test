import { Test, TestingModule } from '@nestjs/testing';
import { handleCustomException } from '../../../utils/helpers';
import { TasksService } from '../tasks.services';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { ProjectsService } from '../../../modules/projects/projects.services';
import { CreateTaskDto, EditTaskDto } from '../dto';

jest.mock('../../../utils/helpers');

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;
  let projectsService: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: ProjectsService,
          useValue: {
            getAllProjects: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task and return success response', async () => {
      const userId = 'user-id';
      const dto: CreateTaskDto = {
        name: 'Test Task',
        project_id: 'project-id',
        status: 'in_progress',
        priority: 'high',
      };
      const mockProjects = [{ id: 'project-id', name: 'Test Project' }];
      (projectsService.getAllProjects as jest.Mock).mockResolvedValue(
        mockProjects,
      );

      const result = await service.createTask(userId, dto);

      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: { ...dto, description: dto.description || '' },
      });
      expect(projectsService.getAllProjects).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        data: { projects: mockProjects },
        status: 'success',
        displayMessage: 'Task created successfully',
      });
    });

    it('should handle an exception correctly', async () => {
      const userId = 'user-id';
      const dto: CreateTaskDto = {
        name: 'Test Task',
        project_id: 'project-id',
        status: 'in_progress',
        priority: 'high',
      };
      const error = new Error('Some error');
      jest.spyOn(prismaService.task, 'create').mockRejectedValueOnce(error);

      await service.createTask(userId, dto);

      expect(handleCustomException).toHaveBeenCalledWith({
        error,
        displayMessage: 'Something went wrong, please try again.',
      });
    });
  });

  describe('editTask', () => {
    it('should edit a task and return success response', async () => {
      const userId = 'user-id';
      const taskId = 'task-id';
      const dto: EditTaskDto = { name: 'Updated Task', project_id: '1244' };
      const mockProjects = [{ id: 'project-id', name: 'Test Project' }];
      (projectsService.getAllProjects as jest.Mock).mockResolvedValue(
        mockProjects,
      );

      const result = await service.editTask(userId, taskId, dto);

      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: dto,
      });
      expect(projectsService.getAllProjects).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        data: { projects: mockProjects },
        status: 'success',
        displayMessage: 'Task updated successfully',
      });
    });

    it('should handle an exception correctly', async () => {
      const userId = 'user-id';
      const taskId = 'task-id';
      const dto: EditTaskDto = { name: 'Updated Task', project_id: '1234' };
      const error = new Error('Some error');
      jest.spyOn(prismaService.task, 'update').mockRejectedValueOnce(error);

      await service.editTask(userId, taskId, dto);

      expect(handleCustomException).toHaveBeenCalledWith({
        error,
        displayMessage: 'Something went wrong, please try again.',
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return success response', async () => {
      const userId = 'user-id';
      const taskId = 'task-id';
      const mockProjects = [{ id: 'project-id', name: 'Test Project' }];
      (projectsService.getAllProjects as jest.Mock).mockResolvedValue(
        mockProjects,
      );

      const result = await service.deleteTask(userId, taskId);

      expect(prismaService.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(projectsService.getAllProjects).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        data: { projects: mockProjects },
        status: 'success',
        displayMessage: 'Task deleted successfully',
      });
    });

    it('should handle an exception correctly', async () => {
      const userId = 'user-id';
      const taskId = 'task-id';
      const error = new Error('Some error');
      jest.spyOn(prismaService.task, 'delete').mockRejectedValueOnce(error);

      await service.deleteTask(userId, taskId);

      expect(handleCustomException).toHaveBeenCalledWith({
        error,
        displayMessage: 'Something went wrong, please try again.',
      });
    });
  });
});
