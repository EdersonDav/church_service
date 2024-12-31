import { Module } from '@nestjs/common';
import { CoreModule } from '../../../core/core.module';
import { LoginController } from './login';
import { TaskController } from './tasks';

@Module({
  imports: [CoreModule],
  controllers: [
    LoginController,
    TaskController
  ],
})
export class ControllerModule { }
