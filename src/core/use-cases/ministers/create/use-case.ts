import { Injectable } from '@nestjs/common';
import { MinisterRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class CreateMinister {
  constructor(
    private readonly ministerRepository: MinisterRepository,
  ) { }

  async execute(input: {
    church_id: UUID;
    user_id: UUID;
    name: string;
  }) {
    const data = await this.ministerRepository.save(input);

    return { data };
  }
}
