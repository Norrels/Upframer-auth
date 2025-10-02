import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { config } from "./config/env";
import { AuthService } from "./service/auth_service";
import { UserRepositoryAdapter } from "./infrastructure/out/persistence/repository.adapter";

const repository = new UserRepositoryAdapter();
const authService = new AuthService(repository);

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: "Upframer Auth API",
          version: "1.0.0",
          description:
            "Authentication API with registration and login endpoints",
        },
        tags: [
          {
            name: "Health",
            description: "Health check endpoints",
          },
          {
            name: "Auth",
            description: "Authentication endpoints",
          },
        ],
      },
    })
  )
  .get("/health", () => "ok", {
    detail: {
      tags: ["Health"],
      summary: "Health check",
      description: "Returns 'ok' if the service is running",
    },
  })
  .post(
    "/auth/register",
    async ({ body, set }) => {
      try {
        const result = await authService.register(body);

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        set.status = 400;
        return {
          success: false,
          error: error instanceof Error ? error.message : "Registration failed",
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        username: t.String({ minLength: 3, maxLength: 30 }),
        password: t.String({ minLength: 8 }),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Register a new user",
        description:
          "Creates a new user account with email, username and password",
      },
    }
  )
  .post(
    "/auth/login",
    async ({ body, set }) => {
      try {
        const result = await authService.login(body);

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        set.status = 400;
        return {
          success: false,
          error: error instanceof Error ? error.message : "Login failed",
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 1 }),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Login user",
        description:
          "Authenticates a user with email and password, returns JWT token",
      },
    }
  )
  .listen(Number(config.PORT));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
