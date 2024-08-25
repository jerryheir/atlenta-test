import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { handleCustomException } from '../../utils/helpers';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          projects: {
            include: {
              activities: true,
              admin: true,
              members: true,
              tasks: true,
            },
          },
        },
      });

      delete user.password;

      return {
        data: { user },
        status: 'success',
      };
    } catch (error) {
      handleCustomException({
        error,
        displayMessage: 'Something went wrong, please try again.',
      });
    }
  }
}
