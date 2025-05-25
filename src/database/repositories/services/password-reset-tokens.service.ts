import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository as TypeORMRepository } from 'typeorm';
import { PasswordResetToken } from '../../entities';
import { PasswordResetTokenRepository } from '../interfaces';
import { UUID } from 'crypto';
import { hashString } from '../../../core/helpers';

@Injectable()
export class PasswordResetTokenService implements PasswordResetTokenRepository {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly entity: TypeORMRepository<PasswordResetToken>,
  ) { }

  async save(token_data: Partial<PasswordResetToken>): Promise<string> {
    const tokenCreated = this.entity.create({
      ...token_data,
      token: hashString(token_data.token as string),
    });

    const tokenSaved = await this.entity.upsert(
      tokenCreated,
      {
        conflictPaths: ['user_id', 'token'],
        upsertType: 'on-conflict-do-update'
      });
    if (!tokenSaved) {
      throw new Error('Error creating verification token');
    }
    return tokenCreated.token;
  }

  async deleteByUserId(user_id: UUID): Promise<void> {
    await this.entity.delete({ user_id });
  }

  async verifyToken(user_id: UUID): Promise<PasswordResetToken | null> {
    const tokenFound = await this.entity.findOne({ where: { user_id, expires_at: MoreThan(new Date()) } });
    if (!tokenFound) {
      throw new Error('Token not found');
    }
    return tokenFound;
  }

  async get(token: string): Promise<PasswordResetToken | null> {
    const tokenFound = await this.entity.findOne({ where: { token: hashString(token) } });

    if (!tokenFound) {
      throw new Error('Token not found');
    }

    return tokenFound;
  }
}
