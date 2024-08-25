import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { AddActivityDto } from './dto';
import { ActivitiesService } from './activities.services';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Activities')
@UseGuards(JwtGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new activity to a project' })
  @ApiBody({
    description: 'Data required to add a new activity',
    type: AddActivityDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Activity added successfully',
    schema: {
      example: {
        status: 'success',
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
  async addActivity(@Body() dto: AddActivityDto) {
    return await this.activitiesService.addActivity(dto);
  }
}
