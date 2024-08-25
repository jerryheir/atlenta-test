import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controllers';
import { AuthService } from '../auth.services';
import { SignInDto, SignUpDto } from '../dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call authService.signUp with the provided DTO', async () => {
      const signUpDto: SignUpDto = {
        email: 'new@test.com',
        password: 'password',
        first_name: 'Test first name',
        last_name: 'Test last name',
      };

      const expectedResult = {
        status: 'success',
        data: {
          user: { id: '1', email: 'test@example.com', name: 'Test User' },
          access_token: 'token',
        },
        displayMessage: 'User registered successfully',
      };

      mockAuthService.signUp.mockResolvedValue(expectedResult);

      const result = await controller.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from authService.signUp', async () => {
      const signUpDto: SignUpDto = {
        email: 'new@test.com',
        password: 'password',
        first_name: 'Test first name',
        last_name: 'Test last name',
      };

      const expectedError = {
        status: 'error',
        displayMessage: 'User already exists',
      };

      mockAuthService.signUp.mockRejectedValue(expectedError);

      await expect(controller.signUp(signUpDto)).rejects.toEqual(expectedError);
    });
  });

  describe('signIn', () => {
    it('should call authService.signIn with the provided DTO', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        status: 'success',
        data: {
          user: { id: '1', email: 'test@example.com' },
          access_token: 'token',
        },
        displayMessage: 'Authentication successful!',
      };

      mockAuthService.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from authService.signIn', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const expectedError = {
        status: 'error',
        displayMessage: 'Invalid credentials',
      };

      mockAuthService.signIn.mockRejectedValue(expectedError);

      await expect(controller.signIn(signInDto)).rejects.toEqual(expectedError);
    });
  });
});
