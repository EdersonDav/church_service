import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ControllerModule } from '../http/controllers';
import { DataBaseModule } from '../../database';
import { CoreModule } from '../../core';
import { MailModule } from './mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailModule,
    DataBaseModule,
    ControllerModule,
    CoreModule,
  ],
})
export class AppModule {}
