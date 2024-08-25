import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../../types/api';
import { handleCustomException } from '../../utils/helpers';
import { CreateTaskDto, EditTaskDto } from './dto';
import { ProjectsService } from '../projects/projects.services';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService,
  ) {}

  async createTask(userId: string, dto: CreateTaskDto): Promise<ApiResponse> {
    try {
      await this.prisma.task.create({
        data: {
          ...dto,
          description: dto.description || '',
        },
      });

      const projects = await this.projectsService.getAllProjects(userId);

      return {
        data: { projects },
        status: 'success',
        displayMessage: 'Task created successfully',
      };
    } catch (error) {
      handleCustomException({
        error,
        displayMessage: 'Something went wrong, please try again.',
      });
    }
  }

  async editTask(
    userId: string,
    taskId: string,
    dto: EditTaskDto,
  ): Promise<ApiResponse> {
    try {
      await this.prisma.task.update({
        where: { id: taskId },
        data: dto,
      });
      const projects = await this.projectsService.getAllProjects(userId);

      return {
        data: { projects },
        status: 'success',
        displayMessage: 'Task updated successfully',
      };
    } catch (error) {
      handleCustomException({
        error,
        displayMessage: 'Something went wrong, please try again.',
      });
    }
  }

  async deleteTask(userId: string, taskId: string): Promise<ApiResponse> {
    try {
      await this.prisma.task.delete({
        where: { id: taskId },
      });
      const projects = await this.projectsService.getAllProjects(userId);

      return {
        data: { projects },
        status: 'success',
        displayMessage: 'Task deleted successfully',
      };
    } catch (error) {
      handleCustomException({
        error,
        displayMessage: 'Something went wrong, please try again.',
      });
    }
  }
}
