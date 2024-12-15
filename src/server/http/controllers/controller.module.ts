import { Module } from '@nestjs/common';
import { CoreModule } from '../../../core/core.module';
import { LoginController } from './login';

@Module({
  imports: [CoreModule],
  controllers: [
    LoginController
  ],
})
export class ControllerModule { }
