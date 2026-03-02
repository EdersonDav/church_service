import { Injectable } from '@nestjs/common';
import { ChurchRepository } from '../../../../database/repositories/interfaces';
import { Output } from './output';

@Injectable()
export class ListChurches {
  constructor(
    private readonly churchRepository: ChurchRepository
  ) { }

  async execute(): Promise<Output> {
    const data = await this.churchRepository.list();
    return { data };
  }
}
