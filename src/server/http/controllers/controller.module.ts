import { Module } from '@nestjs/common';
import { CoreModule } from '../../../core/core.module';
import { LoginController } from './login';
import { TaskController } from './tasks';
import { ChurchController } from './church';
import { UserController } from './user';
import { VerificationCodeController } from './verify-code';

@Module({
  imports: [CoreModule],
  controllers: [
    LoginController,
    TaskController,
    ChurchController,
    UserController,
    VerificationCodeController
  ],
})
export class ControllerModule { }
