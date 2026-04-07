import { Injectable } from '@nestjs/common';
import { ExtraEventRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';

@Injectable()
export class DeleteExtraEvent {
  constructor(
    private readonly extraEventRepository: ExtraEventRepository
  ) { }

  async execute({ event_id }: Input): Promise<void> {
    await this.extraEventRepository.delete(event_id);
  }
}
