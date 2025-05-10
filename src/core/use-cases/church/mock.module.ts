import { Module } from '@nestjs/common';
import { CreateChurch } from './create';
import { MockDatabaseModule } from '../../../database/mock.module';

@Module({
  imports: [MockDatabaseModule],
  providers: [CreateChurch],
  exports: [CreateChurch],
})
export class MockChurchModule { }