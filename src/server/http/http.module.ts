import { Module } from '@nestjs/common';
import { CoreModule } from '../../core';
import { DataBaseModule } from '../../database';

@Module({
  imports: [CoreModule, DataBaseModule, ControllerModule],
})
export class ControllerModule {}
