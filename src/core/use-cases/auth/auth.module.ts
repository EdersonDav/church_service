import { Module } from '@nestjs/common';
// import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LoginController } from '../../../server/http/controllers/login';
import { CreateToken } from './create';
import { ValidateUser } from './validate';
import { env } from '../../../config';
import { DataBaseModule } from '../../../database';
@Module({
  imports: [
    //UsersModule,
    DataBaseModule,
    JwtModule.register({
      global: true,
      secret: env.jwtConstants.secret,
      signOptions: { expiresIn: env.jwtConstants.expiresIn },
    }),
  ],
  providers: [CreateToken, ValidateUser],
  controllers: [LoginController],
  exports: [CreateToken, ValidateUser],
})
export class AuthModule { }
