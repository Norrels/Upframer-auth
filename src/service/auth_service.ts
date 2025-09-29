import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { config } from "@/config/env";

import { UserRepository } from "@/domain/ports/out/persistence/user-repository";

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
}

type LoginInput = Omit<RegisterInput, "username">;

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
}

export class AuthService {
  constructor(private repository: UserRepository) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "7d" });
  }

  verifyToken(token: string): AuthTokenPayload {
    return jwt.verify(token, config.JWT_SECRET) as AuthTokenPayload;
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, username, password } = input;

    const existingUser = await this.repository.findByEmail(email);

    if (existingUser != null) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await this.hashPassword(password);

    const createdUser = await this.repository.createUser(
      email,
      username,
      hashedPassword
    );

    const token = this.generateToken({
      userId: createdUser.id,
      email: createdUser.email,
    });

    return {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
      },
      token,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await this.verifyPassword(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    };
  }
}
