import { Module } from '@nestjs/common';
import { 
  TaskRepository, 
  UserRepository,
  ChurchRepository
 } from './repositories/interfaces';
import { 
  FakeUserRepository, 
  FakeTaskRepository,
  FakeChurchRepository
} from './repositories/fakes';

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
    },
    FakeChurchRepository,
    {
      provide: ChurchRepository,
      useClass: FakeChurchRepository,
    }
  ],
  exports: [
    UserRepository,
    FakeUserRepository,
    FakeTaskRepository,
    TaskRepository,
    ChurchRepository,
    FakeChurchRepository
  ],
})
export class MockDatabaseModule { }
