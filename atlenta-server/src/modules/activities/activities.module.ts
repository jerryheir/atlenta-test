import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.services';
import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesController } from './activities.controllers';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, PrismaService],
})
export class ActivitiesModule {}
