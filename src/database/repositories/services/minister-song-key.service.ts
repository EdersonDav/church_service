import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository as TypeORMRepository } from 'typeorm';
import { UUID } from 'crypto';
import { MinisterSongKey } from '../../entities';
import { MinisterSongKeyRepository } from '../interfaces';

@Injectable()
export class MinisterSongKeyService implements MinisterSongKeyRepository {
  constructor(
    @InjectRepository(MinisterSongKey)
    private readonly entity: TypeORMRepository<MinisterSongKey>,
  ) { }

  async save(item_data: Partial<MinisterSongKey>): Promise<MinisterSongKey> {
    const item = this.entity.create(item_data);
    return this.entity.save(item);
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async getByMinisterAndSong(minister_id: UUID, song_id: UUID): Promise<MinisterSongKey | null> {
    return this.entity.findOne({
      where: {
        minister_id,
        song_id,
      },
      relations: {
        song: true,
      },
    });
  }

  async listByMinister(minister_id: UUID): Promise<MinisterSongKey[]> {
    return this.entity.find({
      where: { minister_id },
      relations: {
        song: true,
      },
      order: {
        song: {
          title: 'ASC',
        },
      },
    });
  }

  async listByMinisterAndSongs(minister_id: UUID, song_ids: UUID[]): Promise<MinisterSongKey[]> {
    if (!song_ids.length) {
      return [];
    }

    return this.entity.find({
      where: {
        minister_id,
        song_id: In(song_ids),
      },
      relations: {
        song: true,
      },
    });
  }

  async upsertByMinisterAndSong(minister_id: UUID, song_id: UUID, custom_key: string): Promise<MinisterSongKey> {
    const record = this.entity.create({
      minister_id,
      song_id,
      custom_key,
    });

    await this.entity.upsert(record, {
      conflictPaths: ['minister_id', 'song_id'],
      skipUpdateIfNoValuesChanged: true,
      upsertType: 'on-conflict-do-update',
    });

    const saved = await this.getByMinisterAndSong(minister_id, song_id);

    if (!saved) {
      throw new Error('Error upserting minister key');
    }

    return saved;
  }
}
