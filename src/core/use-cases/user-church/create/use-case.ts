import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { UserChurchRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';
import { ChurchRoleEnum } from '../../../../enums';

@Injectable()
export class CreateUserChurch {
  constructor(
    private userChurchService: UserChurchRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.userChurchService.save(input)
    return {
      data: {
        church_id: data.church_id as UUID,
        user_id: data.user_id as UUID,
        role: data.role as ChurchRoleEnum
      }
    }
  }
}
