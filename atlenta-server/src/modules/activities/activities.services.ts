import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../../types/api';
import { handleCustomException } from '../../utils/helpers';
import { AddActivityDto } from './dto';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async addActivity(dto: AddActivityDto): Promise<ApiResponse> {
    try {
      await this.prisma.activity.create({
        data: {
          description: dto.description,
          project: {
            connect: { id: dto.project_id },
          },
        },
      });

      return {
        status: 'success',
      };
    } catch (error) {
      handleCustomException({
        error,
      });
    }
  }
}
