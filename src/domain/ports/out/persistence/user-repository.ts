import { User } from "@/domain/entities/user";

export interface UserRepository {
    createUser(email: string, username: string, password: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}