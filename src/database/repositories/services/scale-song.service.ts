import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { UUID } from 'crypto';
import { ScaleSong } from '../../entities';
import { ScaleSongRepository } from '../interfaces';

@Injectable()
export class ScaleSongService implements ScaleSongRepository {
  constructor(
    @InjectRepository(ScaleSong)
    private readonly entity: TypeORMRepository<ScaleSong>,
  ) { }

  async save(item_data: Partial<ScaleSong>): Promise<ScaleSong> {
    const item = this.entity.create(item_data);
    return this.entity.save(item);
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async findByScale(scale_id: UUID): Promise<ScaleSong[]> {
    return this.entity.find({
      where: { scale_id },
      relations: {
        song: true,
        minister: true,
      },
      order: {
        song: {
          title: 'ASC',
        },
      },
    });
  }

  async update(scale_song_id: UUID, data: Partial<ScaleSong>): Promise<ScaleSong | null> {
    const row = await this.entity.findOneBy({ id: scale_song_id });

    if (!row) {
      return null;
    }

    Object.assign(row, data);

    return this.entity.save(row);
  }
}
