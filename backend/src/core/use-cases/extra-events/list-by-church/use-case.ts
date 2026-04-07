import { Injectable } from '@nestjs/common';
import { ExtraEventRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class ListExtraEventsByChurch {
  constructor(
    private readonly extraEventRepository: ExtraEventRepository
  ) { }

  async execute({ church_id }: Input): Promise<Output> {
    const data = await this.extraEventRepository.listByChurch(church_id);
    return { data };
  }
}
