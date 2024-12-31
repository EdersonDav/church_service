import { User } from '../../entities/users.entity';

export abstract class UserRepository {
  abstract save(user: Partial<User>): Promise<User>;
  abstract getByEmail(email: string): Promise<User | null>;
}
