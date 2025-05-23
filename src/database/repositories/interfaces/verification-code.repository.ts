import { UUID } from 'crypto';
import { VerificationCode } from '../../entities/verification-code.entity';

export abstract class VerificationCodeRepository {
  abstract save(code: Partial<VerificationCode>): Promise<string>;
  abstract getLastCodeByUser(user_id: UUID): Promise<VerificationCode | null>;
  abstract deleteByUserId(user_id: UUID): Promise<void>;
  abstract verifyCode(code: string, user_id: UUID): Promise<VerificationCode | null>;
}
