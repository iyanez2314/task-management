import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@turbovets/data';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        isActive: true,
        role: { name: 'admin' },
        organization: { name: 'Test Org' },
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login('test@example.com', 'password123');

      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: expect.objectContaining({
          id: '123',
          email: 'test@example.com',
        }),
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login('wrong@example.com', 'password123')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a new user and return access token', async () => {
      const mockUser = {
        id: '123',
        email: 'new@example.com',
        name: 'New User',
        organizationId: 'org-123',
        roleId: 'role-123',
        role: { name: 'viewer' },
        organization: { name: 'Test Org' },
      };

      // First call checks for existing user (should return null)
      // Second call returns the newly created user
      mockUserRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUser);

      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.register(
        'new@example.com',
        'password123',
        'New User',
        'org-123',
        'role-123'
      );

      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: expect.objectContaining({
          id: '123',
          email: 'new@example.com',
        }),
      });

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@example.com',
          name: 'New User',
          organizationId: 'org-123',
          roleId: 'role-123',
        })
      );
    });
  });
});
