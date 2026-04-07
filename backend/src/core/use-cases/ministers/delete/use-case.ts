import { Injectable } from '@nestjs/common';
import { MinisterRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class DeleteMinister {
  constructor(
    private readonly ministerRepository: MinisterRepository,
  ) { }

  async execute(input: {
    minister_id: UUID;
  }): Promise<void> {
    await this.ministerRepository.delete(input.minister_id);
  }
}
