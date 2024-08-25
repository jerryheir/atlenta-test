import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { TasksController } from '../tasks.controllers';
import { TasksService } from '../tasks.services';
import { CreateTaskDto, EditTaskDto } from '../dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    createTask: jest.fn(),
    editTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  const mockReq = {
    user: {
      id: 'user-id',
    },
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task and return success response', async () => {
      const createTaskDto: CreateTaskDto = {
        name: 'Test Task',
        description: 'Test Description',
        project_id: 'project-id',
        priority: 'high',
        status: 'completed',
      };
      const mockResponse = {
        data: { projects: [] },
        status: 'success',
        displayMessage: 'Task created successfully',
      };
      mockTasksService.createTask.mockResolvedValueOnce(mockResponse);

      const result = await controller.createTask(createTaskDto, mockReq);

      expect(service.createTask).toHaveBeenCalledWith(
        mockReq.user['id'],
        createTaskDto,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('editTask', () => {
    it('should edit a task and return success response', async () => {
      const editTaskDto: EditTaskDto = {
        name: 'Updated Task Name',
        project_id: '1234',
      };
      const taskId = 'task-id';
      const mockResponse = {
        data: { projects: [] },
        status: 'success',
        displayMessage: 'Task updated successfully',
      };
      mockTasksService.editTask.mockResolvedValueOnce(mockResponse);

      const result = await controller.editTask(editTaskDto, mockReq, taskId);

      expect(service.editTask).toHaveBeenCalledWith(
        mockReq.user['id'],
        taskId,
        editTaskDto,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return success response', async () => {
      const taskId = 'task-id';
      const mockResponse = {
        data: { projects: [] },
        status: 'success',
        displayMessage: 'Task deleted successfully',
      };
      mockTasksService.deleteTask.mockResolvedValueOnce(mockResponse);

      const result = await controller.deleteTask(mockReq, taskId);

      expect(service.deleteTask).toHaveBeenCalledWith(
        mockReq.user['id'],
        taskId,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
