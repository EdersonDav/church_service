import { Module } from '@nestjs/common';
import { CoreModule } from '../../../core/core.module';
import { LoginController } from './login';
import { TaskController } from './tasks';
import { ChurchController } from './church';

@Module({
  imports: [CoreModule],
  controllers: [
    LoginController,
    TaskController,
    ChurchController
  ],
})
export class ControllerModule { }
