import { Module } from '@nestjs/common';
import { TaskRepository, UserRepository } from './repositories/interfaces';
import { FakeUserRepository } from './repositories/fakes';
import { FakeTaskRepository } from './repositories/fakes/task.repository';

@Module({
  providers: [
    FakeUserRepository,
    {
      provide: UserRepository,
      useClass: FakeUserRepository,
    },
    FakeTaskRepository,
    {
      provide: TaskRepository,
      useClass: FakeTaskRepository,
    }
  ],
  exports: [
    UserRepository,
    FakeUserRepository,
    FakeTaskRepository,
    TaskRepository
  ],
})
export class MockDatabaseModule { }
