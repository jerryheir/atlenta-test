import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { Request } from 'express';
import { ProjectsService } from './projects.services';
import { CreateProjectDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@UseGuards(JwtGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project for the authenticated user' })
  @ApiBody({
    description: 'Data required to create a new project',
    type: CreateProjectDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Project created successfully',
    schema: {
      example: {
        data: {
          project: {
            id: 'string',
            name: 'string',
            description: 'string',
            admin: {
              id: 'string',
              email: 'string',
              first_name: 'string',
              last_name: 'string',
            },
            members: [
              {
                id: 'string',
                email: 'string',
                first_name: 'string',
                last_name: 'string',
              },
            ],
            tasks: [],
            activities: [],
          },
        },
        status: 'success',
        displayMessage: 'Project created successfully',
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
  async createProject(@Body() dto: CreateProjectDto, @Req() req: Request) {
    const userId = req.user['id'];
    return await this.projectsService.createProject(userId, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a project by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
    schema: {
      example: {
        data: {
          projects: [
            // list of remaining projects after deletion
          ],
        },
        status: 'success',
        displayMessage: 'Project deleted successfully',
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
  async deleteProject(@Req() req: Request, @Param('id') projectId: string) {
    const userId = req.user['id'];
    return await this.projectsService.deleteProject(userId, projectId);
  }
}
