import { Module } from '@nestjs/common';
import { CoreModule } from '../../../core/core.module';
import { LoginController } from './auth';
import { TaskController } from './tasks';
import { ChurchController, MembersController } from './church';
import { UserController } from './user';
import { VerificationCodeController } from './verify-code';
import { SectorController, SectorMembersController } from './sector';
import { ScaleController } from './scale';
import { ExtraEventController } from './extra-events';
import { SongController } from './songs';
import { MinisterController } from './ministers';
import { ScaleSongController } from './scale/songs';

@Module({
  imports: [CoreModule],
  controllers: [
    LoginController,
    TaskController,
    ChurchController,
    UserController,
    MembersController,
    VerificationCodeController,
    SectorController,
    SectorMembersController,
    ScaleController,
    ScaleSongController,
    SongController,
    MinisterController,
    ExtraEventController,
  ],
})
export class ControllerModule { }
