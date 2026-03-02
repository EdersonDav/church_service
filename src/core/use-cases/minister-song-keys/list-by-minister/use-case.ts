import { Injectable } from '@nestjs/common';
import { MinisterSongKeyRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class ListMinisterSongKeys {
  constructor(
    private readonly ministerSongKeyRepository: MinisterSongKeyRepository,
  ) { }

  async execute(input: {
    minister_id: UUID;
  }) {
    const data = await this.ministerSongKeyRepository.listByMinister(input.minister_id);

    return { data };
  }
}
