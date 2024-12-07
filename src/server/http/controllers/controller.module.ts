import { Module } from '@nestjs/common';
import { CoreModule } from '../../../core/core.module';
import { HelloController } from './hello';

@Module({
  imports: [CoreModule],
  controllers: [
    HelloController
  ],
})
export class ControllerModule { }
