import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  MinisterSongKeyRepository,
  SongRepository,
} from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class SetMinisterSongKeys {
  constructor(
    private readonly ministerSongKeyRepository: MinisterSongKeyRepository,
    private readonly songRepository: SongRepository,
  ) { }

  async execute(input: {
    church_id: UUID;
    minister_id: UUID;
    items: Array<{
      song_id: UUID;
      custom_key: string;
    }>;
  }) {
    const map = new Map<UUID, { song_id: UUID; custom_key: string }>();

    for (const item of input.items) {
      map.set(item.song_id, item);
    }

    const uniqueItems = Array.from(map.values());
    const song_ids = uniqueItems.map((item) => item.song_id);

    if (song_ids.length) {
      const songs = await this.songRepository.findByIds(song_ids);

      if (songs.length !== song_ids.length) {
        throw new NotFoundException('One or more songs were not found');
      }

      for (const song of songs) {
        if (song.church_id !== input.church_id) {
          throw new BadRequestException('Song does not belong to this church');
        }
      }
    }

    await Promise.all(
      uniqueItems.map((item) => this.ministerSongKeyRepository.upsertByMinisterAndSong(
        input.minister_id,
        item.song_id,
        item.custom_key,
      )),
    );

    const data = await this.ministerSongKeyRepository.listByMinister(input.minister_id);

    return { data };
  }
}
