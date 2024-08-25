import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../../types/api';
import { handleCustomException } from '../../utils/helpers';
import { CreateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getAllProjects(userId: string) {
    try {
      const projects = await this.prisma.project.findMany({
        where: {
          members: {
            some: {
              id: userId,
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

      return projects;
    } catch (error) {
      handleCustomException({
        error,
        displayMessage: 'Something went wrong, please try again.',
      });
    }
  }

  async createProject(
    userId: string,
    dto: CreateProjectDto,
  ): Promise<ApiResponse> {
    try {
      const project = await this.prisma.project.create({
        data: {
          ...dto,
          admin: {
            connect: { id: userId },
          },
          members: { connect: { id: userId } },
        },
        include: {
          admin: true,
          members: true,
          tasks: true,
          activities: true,
        },
      });

      return {
        data: { project },
        status: 'success',
        displayMessage: 'Project created successfully',
      };
    } catch (error) {
      handleCustomException({
        error,
        displayMessage: 'Something went wrong, please try again.',
      });
    }
  }

  async deleteProject(userId: string, projectId: string): Promise<ApiResponse> {
    try {
      await this.prisma.project.delete({
        where: { id: projectId },
      });
      const projects = await this.getAllProjects(userId);

      return {
        data: { projects },
        status: 'success',
        displayMessage: 'Project deleted successfully',
      };
    } catch (error) {
      handleCustomException({
        error,
        displayMessage: 'Something went wrong, please try again.',
      });
    }
  }
}
