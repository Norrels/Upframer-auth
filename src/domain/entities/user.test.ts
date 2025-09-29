import { describe, it, expect } from "bun:test";
import { User } from "./user";

describe("User Entity", () => {
  it("should create a valid user object", () => {
    const userData: User = {
      id: "test-id-123",
      email: "test@example.com",
      username: "testuser",
      password: "hashedpassword123",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-02"),
    };

    expect(userData.id).toBe("test-id-123");
    expect(userData.email).toBe("test@example.com");
    expect(userData.username).toBe("testuser");
    expect(userData.password).toBe("hashedpassword123");
    expect(userData.createdAt).toBeInstanceOf(Date);
    expect(userData.updatedAt).toBeInstanceOf(Date);
  });

  it("should have all required properties", () => {
    const userData: User = {
      id: "test-id",
      email: "user@domain.com",
      username: "username",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const requiredProperties = ["id", "email", "username", "password", "createdAt", "updatedAt"];

    requiredProperties.forEach(property => {
      expect(userData).toHaveProperty(property);
      expect(userData[property as keyof User]).toBeDefined();
    });
  });

  it("should handle valid email formats", () => {
    const validEmails = [
      "test@example.com",
      "user.name@domain.co.uk",
      "user+tag@example.org",
      "123@numbers.com"
    ];

    validEmails.forEach(email => {
      const userData: User = {
        id: "test-id",
        email: email,
        username: "testuser",
        password: "password",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(userData.email).toBe(email);
    });
  });

  it("should handle different username formats", () => {
    const validUsernames = [
      "user",
      "user123",
      "user_name",
      "user-name",
      "User123"
    ];

    validUsernames.forEach(username => {
      const userData: User = {
        id: "test-id",
        email: "test@example.com",
        username: username,
        password: "password",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(userData.username).toBe(username);
    });
  });

  it("should handle Date objects for createdAt and updatedAt", () => {
    const now = new Date();
    const earlier = new Date(Date.now() - 1000);

    const userData: User = {
      id: "test-id",
      email: "test@example.com",
      username: "testuser",
      password: "password",
      createdAt: earlier,
      updatedAt: now,
    };

    expect(userData.createdAt).toBeInstanceOf(Date);
    expect(userData.updatedAt).toBeInstanceOf(Date);
    expect(userData.updatedAt.getTime()).toBeGreaterThan(userData.createdAt.getTime());
  });
});