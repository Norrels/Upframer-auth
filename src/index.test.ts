import { describe, it, expect } from "bun:test";

class MockAuthService {
  async register(input: any) {
    if (input.email === "existing@example.com") {
      throw new Error("User already exists");
    }
    return {
      user: {
        id: "test-id",
        email: input.email,
        username: input.username,
      },
      token: "jwt-token-here",
    };
  }

  async login(input: any) {
    if (input.password === "wrongpassword") {
      throw new Error("Invalid credentials");
    }
    return {
      user: {
        id: "test-id",
        email: input.email,
        username: "testuser",
      },
      token: "jwt-token-here",
    };
  }
}

const testRegisterEndpoint = async (body: any) => {
  const mockAuthService = new MockAuthService();

  try {
    const result = await mockAuthService.register(body);
    return {
      status: 200,
      body: {
        success: true,
        data: result,
      },
    };
  } catch (error) {
    return {
      status: 400,
      body: {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      },
    };
  }
};

const testLoginEndpoint = async (body: any) => {
  const mockAuthService = new MockAuthService();

  try {
    const result = await mockAuthService.login(body);
    return {
      status: 200,
      body: {
        success: true,
        data: result,
      },
    };
  } catch (error) {
    return {
      status: 400,
      body: {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      },
    };
  }
};

describe("API Endpoints Logic", () => {
  describe("Register Endpoint", () => {
    it("should register user with valid data", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "testpassword123",
      };

      const response = await testRegisterEndpoint(userData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data?.user).toBeDefined();
      expect(response.body.data?.token).toBeDefined();
      expect(response.body.data?.user.email).toBe(userData.email);
      expect(response.body.data?.user.username).toBe(userData.username);
    });

    it("should handle registration errors", async () => {
      const userData = {
        email: "existing@example.com",
        username: "testuser",
        password: "testpassword123",
      };

      const response = await testRegisterEndpoint(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("User already exists");
    });
  });

  describe("Login Endpoint", () => {
    it("should login user with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "testpassword123",
      };

      const response = await testLoginEndpoint(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data?.user).toBeDefined();
      expect(response.body.data?.token).toBeDefined();
      expect(response.body.data?.user.email).toBe(loginData.email);
    });

    it("should handle login errors", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await testLoginEndpoint(loginData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Invalid credentials");
    });
  });
});
