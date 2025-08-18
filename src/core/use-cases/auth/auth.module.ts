import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CreateToken } from './create';
import { ValidateUser } from './validate';
import { env } from '../../../config';
import { DataBaseModule } from '../../../database';
import { UserModule } from '../user';
import { AuthGuard } from '../../guards/auth.guard';
const useCases = [CreateToken, ValidateUser, AuthGuard];
@Module({
  imports: [
    DataBaseModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: env.jwtConstants.secret,
      signOptions: { expiresIn: env.jwtConstants.expiresIn },
    }),
  ],
  providers: [...useCases],
  exports: [...useCases],
})
export class AuthModule { }
