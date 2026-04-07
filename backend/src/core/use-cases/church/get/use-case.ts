import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { ChurchRepository } from '../../../../database/repositories/interfaces';
import { Output } from './output';

@Injectable()
export class GetChurch {
  constructor(
    private churchRepository: ChurchRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.churchRepository.getBy(input.search_data, input.search_by);
    return { data };
  }
}
