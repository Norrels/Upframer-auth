import { describe, it, expect } from "bun:test";
import { UserRepository } from "./user-repository";
import { User } from "@/domain/entities/user";

describe("UserRepository Interface", () => {
  it("should define createUser method signature", () => {
    const mockRepo: UserRepository = {
      createUser: async (email: string, username: string, password: string): Promise<User> => {
        return {
          id: "test-id",
          email,
          username,
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
      findByEmail: async (email: string): Promise<User | null> => {
        return null;
      },
    };

    expect(typeof mockRepo.createUser).toBe("function");
    expect(mockRepo.createUser.length).toBe(3);
  });

  it("should define findByEmail method signature", () => {
    const mockRepo: UserRepository = {
      createUser: async (email: string, username: string, password: string): Promise<User> => {
        return {
          id: "test-id",
          email,
          username,
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
      findByEmail: async (email: string): Promise<User | null> => {
        return null;
      },
    };

    expect(typeof mockRepo.findByEmail).toBe("function");
    expect(mockRepo.findByEmail.length).toBe(1);
  });

  it("should return User from createUser", async () => {
    const mockRepo: UserRepository = {
      createUser: async (email: string, username: string, password: string): Promise<User> => {
        return {
          id: "generated-id",
          email,
          username,
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
      findByEmail: async (email: string): Promise<User | null> => {
        return null;
      },
    };

    const result = await mockRepo.createUser("test@example.com", "testuser", "hashedpassword");

    expect(result).toBeDefined();
    expect(result.id).toBe("generated-id");
    expect(result.email).toBe("test@example.com");
    expect(result.username).toBe("testuser");
    expect(result.password).toBe("hashedpassword");
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it("should return User or null from findByEmail", async () => {
    const mockUser: User = {
      id: "found-id",
      email: "found@example.com",
      username: "founduser",
      password: "hashedpassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockRepo: UserRepository = {
      createUser: async (email: string, username: string, password: string): Promise<User> => {
        return mockUser;
      },
      findByEmail: async (email: string): Promise<User | null> => {
        if (email === "found@example.com") {
          return mockUser;
        }
        return null;
      },
    };

    const foundUser = await mockRepo.findByEmail("found@example.com");
    const notFoundUser = await mockRepo.findByEmail("notfound@example.com");

    expect(foundUser).toBe(mockUser);
    expect(notFoundUser).toBeNull();
  });

  it("should handle async operations correctly", async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const mockRepo: UserRepository = {
      createUser: async (email: string, username: string, password: string): Promise<User> => {
        await delay(10); 
        return {
          id: "async-id",
          email,
          username,
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
      findByEmail: async (email: string): Promise<User | null> => {
        await delay(10); 
        return null;
      },
    };

    const startTime = Date.now();
    const result = await mockRepo.createUser("test@example.com", "testuser", "password");
    const endTime = Date.now();

    expect(result).toBeDefined();
    expect(endTime - startTime).toBeGreaterThanOrEqual(10);
  });
});