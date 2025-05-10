import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Church } from '../../entities';
import { ChurchRepository } from '../interfaces';

@Injectable()
export class ChurchService implements ChurchRepository {
  private onConfliteConfig: any = {
    conflictPaths: ['name'],
    skipUpdateIfNoValuesChanged: true,
    upsertType: 'on-conflict-do-update',
  }
  constructor(
    @InjectRepository(Church)
    private readonly entity: TypeORMRepository<Church>
  ) { }

  async save(church: Partial<Church>): Promise<Church> {
    const churchCreated = this.entity.create(church);
    await this.entity.upsert(churchCreated, this.onConfliteConfig);
    return churchCreated;
  }
}
