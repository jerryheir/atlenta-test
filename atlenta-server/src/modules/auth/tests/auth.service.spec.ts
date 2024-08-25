/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as helpers from '../../../utils/helpers';
import { AuthService } from '../auth.services';
import { UsersService } from '../../users/users.services';
import { PrismaService } from '../../prisma/prisma.service';
import { SignInDto, SignUpDto } from '../dto';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
      };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toEqual({ id: '1', email: 'test@test.com' });
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
      };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@test.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('signIn', () => {
    it('should return user and token if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'password',
        first_name: 'Test first name',
        last_name: 'Test last name',
        created_at: new Date(),
      };
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('token');

      const signInDto: SignInDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const result = await service.signIn(signInDto);

      expect(result).toEqual({
        data: { user: mockUser, access_token: 'token' },
        status: 'success',
        displayMessage: 'Authentication successful!',
      });
    });

    it('should handle invalid credentials', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);
      const handleCustomExceptionSpy = jest.spyOn(
        helpers,
        'handleCustomException',
      );

      const signInDto: SignInDto = {
        email: 'test@test.com',
        password: 'wrongpassword',
      };
      await service.signIn(signInDto);

      expect(handleCustomExceptionSpy).toHaveBeenCalledWith({
        error: expect.any(Error),
        displayMessage: 'Invalid credentials, please try again',
      });
    });
  });

  describe('signUp', () => {
    it('should create a new user and sign in if email is not taken', async () => {
      const signUpDto: SignUpDto = {
        email: 'new@test.com',
        password: 'password',
        first_name: 'Test first name',
        last_name: 'Test last name',
      };
      mockUsersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue({
        ...signUpDto,
        id: '1',
        password: 'hashedPassword',
      });

      const mockSignInResult = {
        data: {
          user: { id: '1', email: 'new@test.com', name: 'Test User' },
          access_token: 'token',
        },
        status: 'success' as 'success' | 'error',
        displayMessage: 'Authentication successful!',
      };
      jest.spyOn(service, 'signIn').mockResolvedValue(mockSignInResult);

      const result = await service.signUp(signUpDto);

      expect(result).toEqual(mockSignInResult);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { ...signUpDto, password: 'hashedPassword' },
      });
    });

    it('should return error if email is already taken', async () => {
      const signUpDto: SignUpDto = {
        email: 'existing@test.com',
        password: 'password',
        first_name: 'Test first name',
        last_name: 'Test last name',
      };
      mockUsersService.findByEmail.mockResolvedValue({
        id: '1',
        email: 'existing@test.com',
      });

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({
        status: 'error',
        displayMessage: 'User already exists',
      });
    });
  });
});
