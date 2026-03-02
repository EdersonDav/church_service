import { Injectable } from '@nestjs/common';
import { SongRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class GetSong {
  constructor(
    private readonly songRepository: SongRepository,
  ) { }

  async execute(input: {
    song_id: UUID;
  }) {
    const data = await this.songRepository.getById(input.song_id);

    return { data };
  }
}
