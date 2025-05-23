import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CreateToken } from './create';
import { ValidateUser } from './validate';
import { env } from '../../../config';
import { DataBaseModule } from '../../../database';
import { UserModule } from '../user';
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
  providers: [CreateToken, ValidateUser],
  exports: [CreateToken, ValidateUser],
})
export class AuthModule { }
