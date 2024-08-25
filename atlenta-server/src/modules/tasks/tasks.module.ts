import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controllers';
import { TasksService } from './tasks.services';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.services';

@Module({
  controllers: [TasksController],
  providers: [ProjectsService, TasksService, PrismaService],
})
export class TasksModule {}
