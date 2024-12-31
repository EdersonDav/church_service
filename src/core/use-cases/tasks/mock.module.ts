import { Module } from '@nestjs/common';
import { CreateTask } from './create';
import { MockDatabaseModule } from '../../../database/mock.module';

@Module({
  imports: [MockDatabaseModule],
  providers: [CreateTask],
  exports: [CreateTask],
})
export class MockTaskModule { }