import { Module } from '@nestjs/common';
import { CreateUser } from './create';
import { MockDatabaseModule } from '../../../database/mock.module';

@Module({
  imports: [MockDatabaseModule],
  providers: [CreateUser],
  exports: [CreateUser],
})
export class MockUserModule { }