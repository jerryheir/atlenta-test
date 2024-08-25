import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { Request } from 'express';
import { TasksService } from './tasks.services';
import { CreateTaskDto, EditTaskDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@UseGuards(JwtGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({
    description: 'Data required to create a new task',
    type: CreateTaskDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Task created successfully',
    schema: {
      example: {
        data: {
          projects: [
            '/* Other Project Properties */',
            {
              tasks: [
                {
                  id: 'string',
                  name: 'string',
                  description: 'string',
                  priority: 'Priority',
                  status: 'Status',
                  project_id: 'string',
                  created_at: 'string',
                },
              ],
            },
          ],
        },
        status: 'success',
        displayMessage: 'Task created successfully',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        status: 'error',
        displayMessage: 'Something went wrong, please try again.',
      },
    },
  })
  async createTask(@Body() dto: CreateTaskDto, @Req() req: Request) {
    const userId = req.user['id'];
    return await this.tasksService.createTask(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit an existing task' })
  @ApiBody({
    description: 'Data required to edit a task',
    type: EditTaskDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    schema: {
      example: {
        data: {
          projects: [
            '/* Other Project Properties */',
            {
              tasks: [
                {
                  id: 'string',
                  name: 'string',
                  description: 'string',
                  priority: 'Priority',
                  status: 'Status',
                  project_id: 'string',
                  created_at: 'string',
                },
              ],
            },
          ],
        },
        status: 'success',
        displayMessage: 'Task updated successfully',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        status: 'error',
        displayMessage: 'Something went wrong, please try again.',
      },
    },
  })
  async editTask(
    @Body() dto: EditTaskDto,
    @Req() req: Request,
    @Param('id') taskId: string,
  ) {
    const userId = req.user['id'];
    return await this.tasksService.editTask(userId, taskId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
    schema: {
      example: {
        data: {
          projects: [
            '/* Other Project Properties */',
            {
              tasks: ['/* Remaining Tasks */'],
            },
          ],
        },
        status: 'success',
        displayMessage: 'Task deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        status: 'error',
        displayMessage: 'Something went wrong, please try again.',
      },
    },
  })
  async deleteTask(@Req() req: Request, @Param('id') taskId: string) {
    const userId = req.user['id'];
    return await this.tasksService.deleteTask(userId, taskId);
  }
}
