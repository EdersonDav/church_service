import { Injectable } from '@nestjs/common';
import { MinisterRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class GetMinisterByUserAndChurch {
  constructor(
    private readonly ministerRepository: MinisterRepository,
  ) { }

  async execute(input: {
    user_id: UUID;
    church_id: UUID;
  }) {
    const data = await this.ministerRepository.getByUserAndChurch(input.user_id, input.church_id);

    return { data };
  }
}
