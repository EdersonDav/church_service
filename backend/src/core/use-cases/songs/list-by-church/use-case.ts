import { Injectable } from '@nestjs/common';
import { SongRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class ListSongsByChurch {
  constructor(
    private readonly songRepository: SongRepository,
  ) { }

  async execute(input: {
    church_id: UUID;
  }) {
    const data = await this.songRepository.listByChurch(input.church_id);

    return { data };
  }
}
