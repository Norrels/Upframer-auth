import { describe, it, expect, beforeEach, mock } from "bun:test";
import "../test-setup";
import { AuthService, RegisterInput, AuthTokenPayload } from "./auth_service";
import { UserRepository } from "@/domain/ports/out/persistence/user-repository";
import { User } from "@/domain/entities/user";

describe("AuthService", () => {
  let authService: AuthService;
  let mockRepository: UserRepository;
  let mockUser: User;

  beforeEach(() => {
    mockUser = {
      id: "test-id",
      email: "test@example.com",
      username: "testuser",
      password: "$2a$10$hashedpassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository = {
      createUser: mock(() => Promise.resolve(mockUser)),
      findByEmail: mock(() => Promise.resolve(null)),
    };

    authService = new AuthService(mockRepository);
  });

  describe("hashPassword", () => {
    it("should hash password correctly", async () => {
      const password = "testpassword";
      const hashedPassword = await authService.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      const password = "testpassword";
      const hashedPassword = await authService.hashPassword(password);

      const isValid = await authService.verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password = "testpassword";
      const wrongPassword = "wrongpassword";
      const hashedPassword = await authService.hashPassword(password);

      const isValid = await authService.verifyPassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      const payload: AuthTokenPayload = {
        userId: "test-id",
        email: "test@example.com",
      };

      const token = authService.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });
  });

  describe("verifyToken", () => {
    it("should verify and decode a valid token", () => {
      const payload: AuthTokenPayload = {
        userId: "test-id",
        email: "test@example.com",
      };

      const token = authService.generateToken(payload);
      const decodedPayload = authService.verifyToken(token);

      expect(decodedPayload.userId).toBe(payload.userId);
      expect(decodedPayload.email).toBe(payload.email);
    });

    it("should throw error for invalid token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => authService.verifyToken(invalidToken)).toThrow();
    });
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const registerInput: RegisterInput = {
        email: "test@example.com",
        username: "testuser",
        password: "testpassword",
      };

      mockRepository.findByEmail = mock(() => Promise.resolve(null));
      mockRepository.createUser = mock(() => Promise.resolve(mockUser));

      const result = await authService.register(registerInput);

      expect(result).toBeDefined();
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.username).toBe(mockUser.username);
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe("string");

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(registerInput.email);
      expect(mockRepository.createUser).toHaveBeenCalledWith(
        registerInput.email,
        registerInput.username,
        expect.any(String)
      );
    });

    it("should throw error when user already exists", async () => {
      const registerInput: RegisterInput = {
        email: "test@example.com",
        username: "testuser",
        password: "testpassword",
      };

      mockRepository.findByEmail = mock(() => Promise.resolve(mockUser));

      await expect(authService.register(registerInput)).rejects.toThrow(
        "User with this email already exists"
      );

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(registerInput.email);
      expect(mockRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login user with correct credentials", async () => {
      const loginInput = {
        email: "test@example.com",
        password: "testpassword",
      };

      const hashedPassword = await authService.hashPassword(loginInput.password);
      const userWithHashedPassword = { ...mockUser, password: hashedPassword };

      mockRepository.findByEmail = mock(() => Promise.resolve(userWithHashedPassword));

      const result = await authService.login(loginInput);

      expect(result).toBeDefined();
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.username).toBe(mockUser.username);
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe("string");

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(loginInput.email);
    });

    it("should throw error when user does not exist", async () => {
      const loginInput = {
        email: "nonexistent@example.com",
        password: "testpassword",
      };

      mockRepository.findByEmail = mock(() => Promise.resolve(null));

      await expect(authService.login(loginInput)).rejects.toThrow("Invalid credentials");

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(loginInput.email);
    });

    it("should throw error when password is incorrect", async () => {
      const loginInput = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const hashedPassword = await authService.hashPassword("correctpassword");
      const userWithHashedPassword = { ...mockUser, password: hashedPassword };

      mockRepository.findByEmail = mock(() => Promise.resolve(userWithHashedPassword));

      await expect(authService.login(loginInput)).rejects.toThrow("Invalid credentials");

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(loginInput.email);
    });
  });
});