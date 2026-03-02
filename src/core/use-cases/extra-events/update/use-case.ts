import { Injectable } from '@nestjs/common';
import { ExtraEventRepository } from '../../../../database/repositories/interfaces';
import { removeNullUndefinedFields } from '../../../helpers';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class UpdateExtraEvent {
  constructor(
    private readonly extraEventRepository: ExtraEventRepository
  ) { }

  async execute({ event_id, event_data }: Input): Promise<Output> {
    const data = await this.extraEventRepository.update(event_id, removeNullUndefinedFields(event_data));
    return { data };
  }
}
