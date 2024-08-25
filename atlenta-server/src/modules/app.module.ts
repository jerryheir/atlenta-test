import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProjectsModule,
    UsersModule,
    TasksModule,
    ActivitiesModule,
  ],
})
export class AppModule {}
