import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../config';
import {
  UserService,
  TaskService,
  SongService,
  MinisterService,
  MinisterSongKeyService,
  ChurchService,
  VerificationCodeService,
  EmailService,
  PasswordResetTokenService,
  UserChurchService,
  SectorService,
  UserSectorService,
  ScaleService,
  ParticipantService,
  UnavailabilityService,
  UserTaskService,
  ExtraEventService,
  ScaleSongService,
  ChurchJoinRequestService
} from './repositories/services';

import {
  TaskRepository,
  SongRepository,
  MinisterRepository,
  MinisterSongKeyRepository,
  UserRepository,
  ChurchRepository,
  VerificationCodeRepository,
  EmailRepository,
  PasswordResetTokenRepository,
  UserChurchRepository,
  SectorRepository,
  UserSectorRepository,
  ScaleRepository,
  ParticipantRepository,
  UnavailabilityRepository,
  UserTaskRepository,
  ExtraEventRepository,
  ScaleSongRepository,
  ChurchJoinRequestRepository
} from './repositories/interfaces';

import {
  Task,
  Song,
  Minister,
  MinisterSongKey,
  User,
  Church,
  Participant,
  Scale,
  Sector,
  Unavailability,
  UserChurch,
  UserTask,
  VerificationCode,
  PasswordResetToken,
  UserSector,
  ExtraEvent,
  ScaleSong,
  ChurchJoinRequest
} from './entities';

const entities = [
  User,
  Task,
  Song,
  Minister,
  MinisterSongKey,
  Church,
  Participant,
  Scale,
  Sector,
  Unavailability,
  UserChurch,
  ChurchJoinRequest,
  UserTask,
  VerificationCode,
  PasswordResetToken,
  UserSector,
  ExtraEvent,
  ScaleSong
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.db.HOST,
      port: env.db.PORT,
      database: env.db.NAME,
      entities: entities,
      password: env.db.PASSWORD,
      username: env.db.USER,
      synchronize: false,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: UserService,
    },
    TaskService,
    {
      provide: TaskRepository,
      useClass: TaskService
    },
    SongService,
    {
      provide: SongRepository,
      useClass: SongService
    },
    MinisterService,
    {
      provide: MinisterRepository,
      useClass: MinisterService,
    },
    MinisterSongKeyService,
    {
      provide: MinisterSongKeyRepository,
      useClass: MinisterSongKeyService,
    },
    ChurchService,
    {
      provide: ChurchRepository,
      useClass: ChurchService
    },
    VerificationCodeService,
    {
      provide: VerificationCodeRepository,
      useClass: VerificationCodeService,
    },
    EmailService,
    {
      provide: EmailRepository,
      useClass: EmailService,
    },
    PasswordResetTokenService,
    {
      provide: PasswordResetTokenRepository,
      useClass: PasswordResetTokenService,
    },
    UserChurchService,
    {
      provide: UserChurchRepository,
      useClass: UserChurchService,
    },
    ChurchJoinRequestService,
    {
      provide: ChurchJoinRequestRepository,
      useClass: ChurchJoinRequestService,
    },
    SectorService,
    {
      provide: SectorRepository,
      useClass: SectorService,
    },
    UserSectorService,
    {
      provide: UserSectorRepository,
      useClass: UserSectorService,
    },
    ScaleService,
    {
      provide: ScaleRepository,
      useClass: ScaleService,
    },
    ParticipantService,
    {
      provide: ParticipantRepository,
      useClass: ParticipantService,
    },
    UnavailabilityService,
    {
      provide: UnavailabilityRepository,
      useClass: UnavailabilityService,
    },
    UserTaskService,
    {
      provide: UserTaskRepository,
      useClass: UserTaskService,
    },
    ExtraEventService,
    {
      provide: ExtraEventRepository,
      useClass: ExtraEventService,
    },
    ScaleSongService,
    {
      provide: ScaleSongRepository,
      useClass: ScaleSongService,
    }
  ],
  exports: [
    UserRepository,
    UserService,
    TaskRepository,
    TaskService,
    SongRepository,
    SongService,
    MinisterRepository,
    MinisterService,
    MinisterSongKeyRepository,
    MinisterSongKeyService,
    ChurchRepository,
    ChurchService,
    VerificationCodeRepository,
    VerificationCodeService,
    EmailRepository,
    EmailService,
    PasswordResetTokenRepository,
    PasswordResetTokenService,
    UserChurchRepository,
    UserChurchService,
    ChurchJoinRequestRepository,
    ChurchJoinRequestService,
    SectorRepository,
    SectorService,
    UserSectorRepository,
    UserSectorService,
    ScaleRepository,
    ScaleService,
    ParticipantRepository,
    ParticipantService,
    UnavailabilityRepository,
    UnavailabilityService,
    UserTaskRepository,
    UserTaskService,
    ExtraEventRepository,
    ExtraEventService,
    ScaleSongRepository,
    ScaleSongService
  ],
})
export class DataBaseModule { }
