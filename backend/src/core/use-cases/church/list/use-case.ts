import { Injectable } from '@nestjs/common';
import { UserChurchRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class ListChurches {
  constructor(
    private readonly userChurchRepository: UserChurchRepository
  ) { }

  async execute({ user_id }: Input): Promise<Output> {
    const data = await this.userChurchRepository.listByUser(user_id);
    return { data: data.map((item) => item.church) };
  }
}
