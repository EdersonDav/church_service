import { Module } from '@nestjs/common';
import { ControllerModule } from '../http/controllers';
import { DataBaseModule } from '../../database';
import { CoreModule } from '../../core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DataBaseModule,
    ControllerModule,
    CoreModule,
  ],
})
export class AppModule {}
