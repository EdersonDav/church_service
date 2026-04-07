import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { UserChurchRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class GetUserChurch {
  constructor(
    private userChurchService: UserChurchRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.userChurchService.getByUserAndChurch(
      input.user_id,
      input.church_id
    );
    return {
      data
    };
  }
}
