import { UUID } from 'crypto';
import { VerificationCode } from '../../entities/verification-code.entity';

export abstract class VerificationCodeRepository {
  abstract save(code: Partial<VerificationCode>): Promise<boolean>;
  abstract getLastCodeByUser(user_id: UUID): Promise<VerificationCode | null>;
}
