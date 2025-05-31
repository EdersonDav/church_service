import { UUID } from 'crypto';
import { PasswordResetToken } from '../../entities/password-reset-token.entity';

export abstract class PasswordResetTokenRepository {
  abstract save(token: Partial<PasswordResetToken>): Promise<string>;
  abstract deleteByUserId(user_id: UUID): Promise<void>;
  abstract verifyToken(user_id: UUID): Promise<PasswordResetToken | null>;
}
