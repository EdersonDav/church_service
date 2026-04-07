import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { DataBaseModule } from '../../database';
import { TaskModule } from './tasks';
import { ChurchModule } from './church';
import { UserModule } from './user';
import { VerificationCodeModule } from './verification-code';
import { PasswordResetTokenModule } from './password-reset-token';
import { EmailModule } from './emails';
import { UserChurchModule } from './user-church';
import { SectorModule } from './sectors';
import { UserSectorModule } from './user-sector';
import { ScaleModule } from './scales';
import { UnavailabilityModule } from './unavailability';
import { UserTaskModule } from './user-task';
import { ExtraEventModule } from './extra-events';
import { SongModule } from './songs';
import { MinisterModule } from './ministers';
import { MinisterSongKeyModule } from './minister-song-keys';
import { ScaleSongModule } from './scale-songs';

const modules = [
  TaskModule,
  ChurchModule,
  UserModule,
  VerificationCodeModule,
  EmailModule,
  PasswordResetTokenModule,
  AuthModule,
  UserChurchModule,
  SectorModule,
  UserSectorModule,
  ScaleModule,
  UnavailabilityModule,
  UserTaskModule,
  ExtraEventModule,
  SongModule,
  MinisterModule,
  MinisterSongKeyModule,
  ScaleSongModule,
];

@Module({
  imports: [...modules, DataBaseModule],
  exports: [...modules],
})
export class UseCasesModule { }
