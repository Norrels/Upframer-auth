import { Elysia, t } from "elysia";
import { config } from "./config/env";
import { AuthService } from "./service/auth_service";
import { UserRepositoryAdapter } from "./infrastructure/out/persistence/repository.adapter";

const repository = new UserRepositoryAdapter();
const authService = new AuthService(repository);

const app = new Elysia()
  .get("/health", () => "ok")
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
    }
  )
  .listen({
    port: Number(config.PORT),
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
