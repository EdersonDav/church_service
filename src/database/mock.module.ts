import { Module } from '@nestjs/common';
import { 
  TaskRepository, 
  UserRepository,
  ChurchRepository,
  VerificationCodeRepository
} from './repositories/interfaces';
import { 
  FakeUserRepository, 
  FakeTaskRepository,
  FakeChurchRepository,
  FakeVerificationCodeRepository
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
    },
    FakeVerificationCodeRepository,
    {
      provide: VerificationCodeRepository,
      useClass: FakeVerificationCodeRepository,
    }
  ],
  exports: [
    UserRepository,
    FakeUserRepository,
    FakeTaskRepository,
    TaskRepository,
    ChurchRepository,
    FakeChurchRepository,
    VerificationCodeRepository,
    FakeVerificationCodeRepository
  ],
})
export class MockDatabaseModule { }
