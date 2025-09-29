import { UserRepository } from "@/domain/ports/out/persistence/user-repository";
import { db } from ".";
import { users } from "./schemas/user-schema";
import { User } from "@/domain/entities/user";
import { eq } from "drizzle-orm";

export class UserRepositoryAdapter implements UserRepository {
  async createUser(
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ email, username, password })
      .returning();
    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user || null;
  }
}
