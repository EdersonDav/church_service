import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  MinisterRepository,
  MinisterSongKeyRepository,
  ScaleRepository,
  ScaleSongRepository,
  SongRepository,
} from '../../../../database/repositories/interfaces';
import { Minister, Scale, Song } from '../../../../database/entities';
import { UUID } from 'crypto';

@Injectable()
export class SetScaleSongs {
  constructor(
    private readonly scaleRepository: ScaleRepository,
    private readonly scaleSongRepository: ScaleSongRepository,
    private readonly songRepository: SongRepository,
    private readonly ministerRepository: MinisterRepository,
    private readonly ministerSongKeyRepository: MinisterSongKeyRepository,
  ) { }

  async execute(input: {
    church_id: UUID;
    sector_id: UUID;
    scale_id: UUID;
    song_ids: UUID[];
    minister_id?: UUID;
  }) {
    const scale = await this.scaleRepository.findById(input.scale_id);

    if (!scale || scale.sector_id !== input.sector_id || scale.sector?.church_id !== input.church_id) {
      throw new NotFoundException('Scale not found');
    }

    const uniqueSongIds = Array.from(new Set(input.song_ids));
    const songs = await this.songRepository.findByIds(uniqueSongIds);

    if (songs.length !== uniqueSongIds.length) {
      throw new NotFoundException('One or more songs were not found');
    }

    for (const song of songs) {
      if (song.church_id !== input.church_id) {
        throw new BadRequestException('Song does not belong to this church');
      }
    }

    const minister = await this.resolveMinister({
      church_id: input.church_id,
      scale,
      preferred_minister_id: input.minister_id,
      strict: true,
    });

    const customKeysMap = await this.getCustomKeysMap(minister?.id, uniqueSongIds);
    const songsMap = new Map(songs.map((song) => [song.id, song]));

    const currentRows = await this.scaleSongRepository.findByScale(input.scale_id);
    const desiredSet = new Set(uniqueSongIds);

    const removals = currentRows.filter((row) => !desiredSet.has(row.song_id));
    await Promise.all(removals.map((row) => this.scaleSongRepository.delete(row.id)));

    for (const song_id of uniqueSongIds) {
      const song = songsMap.get(song_id);

      if (!song) {
        continue;
      }

      const key = customKeysMap.get(song_id) ?? song.default_key;
      const current = currentRows.find((row) => row.song_id === song_id);

      if (current) {
        await this.scaleSongRepository.update(current.id, {
          key,
          minister_id: minister?.id ?? null,
        });
        continue;
      }

      await this.scaleSongRepository.save({
        scale_id: input.scale_id,
        song_id,
        key,
        minister_id: minister?.id ?? null,
      });
    }

    const data = await this.scaleSongRepository.findByScale(input.scale_id);

    return {
      data,
      selected_minister: minister,
    };
  }

  private async resolveMinister(input: {
    church_id: UUID;
    scale: Scale;
    preferred_minister_id?: UUID;
    strict: boolean;
  }): Promise<Minister | null> {
    const participantUserIds: UUID[] = Array.from(
      new Set<UUID>((input.scale.participants || []).map((item) => item.user_id as UUID)),
    );

    if (!participantUserIds.length) {
      if (input.preferred_minister_id) {
        throw new BadRequestException('Minister is not scheduled on this scale');
      }

      return null;
    }

    const ministers = await this.ministerRepository.findByChurchAndUsers(input.church_id, participantUserIds);

    if (input.preferred_minister_id) {
      const selected = ministers.find((minister) => minister.id === input.preferred_minister_id);

      if (!selected) {
        throw new BadRequestException('Minister is not scheduled on this scale');
      }

      return selected;
    }

    if (ministers.length === 1) {
      return ministers[0];
    }

    if (input.strict && ministers.length > 1) {
      throw new BadRequestException('Multiple ministers scheduled. Provide minister_id');
    }

    return null;
  }

  private async getCustomKeysMap(minister_id: UUID | undefined, song_ids: UUID[]): Promise<Map<UUID, string>> {
    if (!minister_id || !song_ids.length) {
      return new Map();
    }

    const items = await this.ministerSongKeyRepository.listByMinisterAndSongs(minister_id, song_ids);

    return new Map(items.map((item) => [item.song_id, item.custom_key]));
  }
}
