import { Injectable } from '@nestjs/common';
import {
  MinisterRepository,
  MinisterSongKeyRepository,
  ScaleRepository,
  ScaleSongRepository,
} from '../../../../database/repositories/interfaces';
import { Minister, ScaleSong } from '../../../../database/entities';
import { UUID } from 'crypto';

@Injectable()
export class RecalculateScaleSongKeys {
  constructor(
    private readonly scaleRepository: ScaleRepository,
    private readonly scaleSongRepository: ScaleSongRepository,
    private readonly ministerRepository: MinisterRepository,
    private readonly ministerSongKeyRepository: MinisterSongKeyRepository,
  ) { }

  async execute(input: {
    scale_id: UUID;
  }) {
    const scale = await this.scaleRepository.findById(input.scale_id);

    if (!scale || !scale.sector?.church_id) {
      return { data: [] as ScaleSong[] };
    }

    const rows = await this.scaleSongRepository.findByScale(input.scale_id);

    if (!rows.length) {
      return { data: rows };
    }

    const minister = await this.resolveMinister(scale.sector.church_id as UUID, scale, rows);
    const customKeyMap = await this.getCustomKeysMap(minister?.id, rows.map((row) => row.song_id));

    await Promise.all(rows.map(async (row) => {
      const default_key = row.song?.default_key ?? row.key;
      const key = customKeyMap.get(row.song_id) ?? default_key;
      const minister_id = minister?.id ?? null;

      if (row.key === key && row.minister_id === minister_id) {
        return;
      }

      await this.scaleSongRepository.update(row.id, {
        key,
        minister_id,
      });
    }));

    const data = await this.scaleSongRepository.findByScale(input.scale_id);

    return { data };
  }

  private async resolveMinister(church_id: UUID, scale: any, rows: ScaleSong[]): Promise<Minister | null> {
    const participantUserIds: UUID[] = Array.from(
      new Set<UUID>((scale.participants || []).map((item: any) => item.user_id as UUID)),
    );

    if (!participantUserIds.length) {
      return null;
    }

    const candidates = await this.ministerRepository.findByChurchAndUsers(church_id, participantUserIds);

    const storedMinisterIds = Array.from(new Set(rows.map((row) => row.minister_id).filter(Boolean))) as UUID[];

    if (storedMinisterIds.length === 1) {
      const current = candidates.find((candidate) => candidate.id === storedMinisterIds[0]);

      if (current) {
        return current;
      }
    }

    if (candidates.length === 1) {
      return candidates[0];
    }

    return null;
  }

  private async getCustomKeysMap(minister_id: UUID | undefined, song_ids: UUID[]): Promise<Map<UUID, string>> {
    if (!minister_id || !song_ids.length) {
      return new Map();
    }

    const uniqueSongIds = Array.from(new Set(song_ids));
    const items = await this.ministerSongKeyRepository.listByMinisterAndSongs(minister_id, uniqueSongIds);

    return new Map(items.map((item) => [item.song_id, item.custom_key]));
  }
}
