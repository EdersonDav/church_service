import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { ChurchRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class DeleteChurch {
  constructor(
    private churchService: ChurchRepository
  ) { }
  async execute(input: Input): Promise<void> {
    await this.churchService.delete(input.church_id);
  }
}
