import { Module } from '@nestjs/common';
import { UsersService } from './users.services';
import { PrismaService } from '../prisma/prisma.service';
import { UsersController } from './users.controllers';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
