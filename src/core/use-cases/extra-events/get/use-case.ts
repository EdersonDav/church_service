import { Injectable } from '@nestjs/common';
import { ExtraEventRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class GetExtraEvent {
  constructor(
    private readonly extraEventRepository: ExtraEventRepository
  ) { }

  async execute({ event_id }: Input): Promise<Output> {
    const data = await this.extraEventRepository.getById(event_id);
    return { data };
  }
}
