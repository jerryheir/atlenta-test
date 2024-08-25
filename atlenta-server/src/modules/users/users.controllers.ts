import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { Request } from 'express';
import { UsersService } from './users.services';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersServices: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({
    status: 200,
    description: 'User details retrieved successfully',
    schema: {
      example: {
        data: {
          user: {
            id: 'string',
            email: 'string',
            projects: [
              {
                id: 'string',
                name: 'string',
                tasks: [],
                activities: [],
                admin: {
                  id: 'string',
                  email: 'string',
                },
                members: [
                  {
                    id: 'string',
                    email: 'string',
                  },
                ],
              },
            ],
          },
        },
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
  async getUserById(@Req() req: Request) {
    const userId = req.user['id'];
    return await this.usersServices.getUserById(userId);
  }
}
