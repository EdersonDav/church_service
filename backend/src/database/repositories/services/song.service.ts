import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository as TypeORMRepository } from 'typeorm';
import { UUID } from 'crypto';
import { Song } from '../../entities';
import { SongRepository } from '../interfaces';

@Injectable()
export class SongService implements SongRepository {
  constructor(
    @InjectRepository(Song)
    private readonly entity: TypeORMRepository<Song>,
  ) { }

  async save(song_data: Partial<Song>): Promise<Song> {
    const song = this.entity.create(song_data);
    return this.entity.save(song);
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async getById(song_id: UUID): Promise<Song | null> {
    return this.entity.findOneBy({ id: song_id });
  }

  async listByChurch(church_id: UUID): Promise<Song[]> {
    return this.entity.find({
      where: { church_id },
      order: { title: 'ASC' },
    });
  }

  async findByIds(song_ids: UUID[]): Promise<Song[]> {
    if (!song_ids.length) {
      return [];
    }

    return this.entity.find({
      where: { id: In(song_ids) },
    });
  }

  async update(song_id: UUID, song_set: Partial<Song>): Promise<Song | null> {
    const song = await this.entity.findOneBy({ id: song_id });

    if (!song) {
      return null;
    }

    Object.assign(song, song_set);

    return this.entity.save(song);
  }
}
