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
  
  async save(code: Partial<VerificationCode>): Promise<boolean> {
    const codeCreated = this.entity.create(code);
    await this.entity.save(codeCreated);
    return Boolean(codeCreated);
  }
}
