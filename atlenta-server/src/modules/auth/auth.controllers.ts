import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.services';
import { SignInDto, SignUpDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  @ApiOperation({ summary: 'Register a new user and return JWT access token' })
  @ApiBody({
    description: 'User details required for registration',
    type: SignUpDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User registered successfully',
    schema: {
      example: {
        data: {
          user: {
            id: 'string',
            email: 'string',
            first_name: 'string',
            last_name: 'string',
          },
          access_token: 'string',
        },
        status: 'success',
        displayMessage: 'Authentication successful!',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. User already exists.',
    schema: {
      example: {
        status: 'error',
        displayMessage: 'User already exists',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        status: 'error',
        displayMessage: 'Authentication failed',
      },
    },
  })
  async signUp(@Body() dto: SignUpDto) {
    return await this.authService.signUp(dto);
  }

  @Post('sign_in')
  @ApiOperation({ summary: 'Authenticate user and return JWT access token' })
  @ApiBody({
    description: 'User credentials required for authentication',
    type: SignInDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully',
    schema: {
      example: {
        data: {
          user: {
            id: 'string',
            email: 'string',
            first_name: 'string',
            last_name: 'string',
          },
          access_token: 'string',
        },
        status: 'success',
        displayMessage: 'Authentication successful!',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
    schema: {
      example: {
        status: 'error',
        displayMessage: 'Invalid credentials, please try again.',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        status: 'error',
        displayMessage:
          'Authentication failed, please check credentials and try again.',
      },
    },
  })
  async signIn(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto);
  }
}
