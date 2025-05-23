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
  
  async save(code_data: Partial<VerificationCode>): Promise<string> {
    const codeCreated = this.entity.create(code_data);
    const codeSaved = await this.entity.upsert(
      codeCreated, 
      {
        conflictPaths:['user_id', 'code'], 
        upsertType: 'on-conflict-do-update'
      });
    if (!codeSaved) {
      throw new Error('Error creating verification code');
    }
    return codeCreated.code;
  }
  
  async deleteByUserId(user_id: UUID): Promise<void> {
    const codeFound = await this.entity.findOne({ where: { user_id } });
    if (!codeFound) {
      throw new Error('Code not found');
    }
    await this.entity.delete(codeFound.id);
  }

  async verifyCode(code: string, user_id: UUID): Promise<VerificationCode | null> {
    const codeFound = await this.entity.findOne({ where: { code, user_id } });
    if (!codeFound) {
      throw new Error('Code not found');
    }
    return codeFound;
  }
}
