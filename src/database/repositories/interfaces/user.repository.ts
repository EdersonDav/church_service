import { UUID } from 'crypto';
import { User } from '../../entities/users.entity';

export abstract class UserRepository {
  abstract save(user: Partial<User>): Promise<User>;
  abstract update(user_id: UUID, user_set: Partial<User>): Promise<User | null>;
  abstract getBy<K extends keyof User>(search_value: User[K], search_by: K): Promise<User | null>;
  abstract deleteByEmail(email: string): Promise<void>;
  abstract getNotVerifiedByEmail(email: string): Promise<User | null>;
  abstract markAsVerified(user_id: UUID): Promise<void>;
}
