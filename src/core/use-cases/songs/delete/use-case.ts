import { Injectable } from '@nestjs/common';
import { SongRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class DeleteSong {
  constructor(
    private readonly songRepository: SongRepository,
  ) { }

  async execute(input: {
    song_id: UUID;
  }): Promise<void> {
    await this.songRepository.delete(input.song_id);
  }
}
