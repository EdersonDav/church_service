import { Injectable } from '@nestjs/common';
import { ExtraEventRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class CreateExtraEvent {
  constructor(
    private readonly extraEventRepository: ExtraEventRepository
  ) { }

  async execute(input: Input): Promise<Output> {
    const data = await this.extraEventRepository.save(input);
    return { data };
  }
}
