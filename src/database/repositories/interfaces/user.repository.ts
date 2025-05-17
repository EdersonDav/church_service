import { UUID } from 'crypto';
import { User } from '../../entities/users.entity';

export abstract class UserRepository {
  abstract save(user: Partial<User>): Promise<User>;
  abstract update(user_id: UUID, user_set: Partial<User>): Promise<boolean>;
  abstract getByEmail(email: string): Promise<User | null>;
}
