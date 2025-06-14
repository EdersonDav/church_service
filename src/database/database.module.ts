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
  UserChurchService
} from './repositories/services';

import {
  TaskRepository,
  UserRepository,
  ChurchRepository,
  VerificationCodeRepository,
  EmailRepository,
  PasswordResetTokenRepository,
  UserChurchRepository
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
  PasswordResetToken
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
  PasswordResetToken
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
    UserChurchService
  ],
})
export class DataBaseModule { }
