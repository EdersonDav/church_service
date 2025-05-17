import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { VerificationCode } from '../../entities';
import { VerificationCodeRepository } from '../interfaces';
import { UUID } from 'crypto';

@Injectable()
export class VerificationCodeService implements VerificationCodeRepository {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly entity: TypeORMRepository<VerificationCode>,
  ) { }
  
  async getLastCodeByUser(user_id: UUID): Promise<VerificationCode | null> {
    const codeFound = await this.entity.findOne({ where: { user_id }, order: { created_at: 'DESC' } })
    return codeFound
  }
  
  async save(code: Partial<VerificationCode>): Promise<string> {
    const codeCreated = this.entity.create(code);
    const codeSaved = await this.entity.save(codeCreated);
    if (!codeSaved) {
      throw new Error('Error creating verification code');
    }
    return codeSaved.code;
  }
}
