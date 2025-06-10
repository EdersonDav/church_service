import { Module } from '@nestjs/common';
import { CoreModule } from '../../../core/core.module';
import { LoginController } from './auth';
import { TaskController } from './tasks';
import { ChurchController, MembersController } from './church';
import { UserController } from './user';
import { VerificationCodeController } from './verify-code';

@Module({
  imports: [CoreModule],
  controllers: [
    LoginController,
    TaskController,
    ChurchController,
    UserController,
    MembersController,
    VerificationCodeController
  ],
})
export class ControllerModule { }
