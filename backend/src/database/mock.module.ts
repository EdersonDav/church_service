import { Module } from '@nestjs/common';
import { 
  TaskRepository, 
  UserRepository,
  ChurchRepository,
  VerificationCodeRepository,
  EmailRepository
} from './repositories/interfaces';
import { 
  FakeUserRepository, 
  FakeTaskRepository,
  FakeChurchRepository,
  FakeVerificationCodeRepository,
  FakeEmailRepository
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
    },
    FakeEmailRepository,
    {
      provide: EmailRepository,
      useClass: FakeEmailRepository,
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
    FakeVerificationCodeRepository,
    EmailRepository,
    FakeEmailRepository
  ],
})
export class MockDatabaseModule { }
