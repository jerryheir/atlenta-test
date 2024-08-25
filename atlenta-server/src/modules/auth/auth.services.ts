import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.services';
import { SignInDto, SignUpDto } from './dto';
import { ApiResponse } from '../../types/api';
import { handleCustomException } from '../../utils/helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }

    return null;
  }

  async signIn({ email, password }: SignInDto): Promise<ApiResponse> {
    try {
      const user = await this.validateUser(email, password);
      if (!user) {
        handleCustomException({
          error: new Error(),
          displayMessage: 'Invalid credentials, please try again',
        });
      }
      const payload = { email: user.email, sub: user.id };
      return {
        data: { user, access_token: this.jwtService.sign(payload) },
        status: 'success',
        displayMessage: 'Authentication successful!',
      };
    } catch (error) {
      return {
        error,
        status: 'error',
        displayMessage:
          'Authentication failed, please check credentials and try again',
      };
    }
  }

  async signUp(dto: SignUpDto): Promise<ApiResponse> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const existing_user = await this.userService.findByEmail(dto.email);

      if (existing_user) {
        return {
          status: 'error',
          displayMessage: 'User already exists',
        };
      }

      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });
      return this.signIn({ email: user.email, password: dto.password });
    } catch (error) {
      return {
        error,
        status: 'error',
        displayMessage: 'Authentication failed',
      };
    }
  }
}
