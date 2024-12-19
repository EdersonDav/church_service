import { Module } from '@nestjs/common';
import { CreateToken } from './create';
import { ValidateUser } from './validate';
import { MockDatabaseModule } from '../../../database/mock.module';
import { JwtService } from '@nestjs/jwt';
import { FakeJWT } from '../../../database/repositories/fakes/jwt.service';

const useCases = [CreateToken, ValidateUser];

@Module({
  imports: [MockDatabaseModule],
  providers: [
    ...useCases,
    {
      provide: JwtService,
      useClass: FakeJWT,
    },
  ],
  exports: useCases,
})
export class MockAuthModule { }