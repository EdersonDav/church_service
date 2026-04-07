import { Injectable } from '@nestjs/common';
import { SongRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class CreateSong {
  constructor(
    private readonly songRepository: SongRepository,
  ) { }

  async execute(input: {
    church_id: UUID;
    title: string;
    default_key: string;
  }) {
    const data = await this.songRepository.save(input);

    return { data };
  }
}
