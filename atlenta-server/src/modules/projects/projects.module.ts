import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controllers';
import { ProjectsService } from './projects.services';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
})
export class ProjectsModule {}
