import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/interfaces';
import { FakeUserRepository } from './repositories/fakes';

@Module({
  providers: [
    FakeUserRepository,
    {
      provide: UserRepository,
      useClass: FakeUserRepository,
    }
  ],
  exports: [
    UserRepository,
    FakeUserRepository
  ],
})
export class MockDatabaseModule { }
