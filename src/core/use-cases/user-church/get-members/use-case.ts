import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { UserChurchRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class GetUserChurchMembers {
  constructor(
    private userChurchService: UserChurchRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.userChurchService.getChurchMembers(
      input.church_id
    );
    return {
      data
    };
  }
}
