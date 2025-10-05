import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../config';
import {
  UserService,
  TaskService,
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
  UserTaskService
} from './repositories/services';

import {
  TaskRepository,
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
  UserTaskRepository
} from './repositories/interfaces';

import {
  Task,
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
  UserSector
} from './entities';

const entities = [
  User,
  Task,
  Church,
  Participant,
  Scale,
  Sector,
  Unavailability,
  UserChurch,
  UserTask,
  VerificationCode,
  PasswordResetToken,
  UserSector
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
    }
  ],
  exports: [
    UserRepository,
    UserService,
    TaskRepository,
    TaskService,
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
    UserTaskService
  ],
})
export class DataBaseModule { }
