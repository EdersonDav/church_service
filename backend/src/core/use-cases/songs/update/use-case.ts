import { Injectable } from '@nestjs/common';
import { SongRepository } from '../../../../database/repositories/interfaces';
import { removeNullUndefinedFields } from '../../../helpers';
import { UUID } from 'crypto';

@Injectable()
export class UpdateSong {
  constructor(
    private readonly songRepository: SongRepository,
  ) { }

  async execute(input: {
    song_id: UUID;
    song_data: {
      title?: string;
      default_key?: string;
    };
  }) {
    const data = await this.songRepository.update(input.song_id, removeNullUndefinedFields(input.song_data));

    return { data };
  }
}
