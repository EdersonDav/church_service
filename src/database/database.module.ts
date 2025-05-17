import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../config';
import { 
  UserService, 
  TaskService, 
  ChurchService,
  VerificationCodeService
} from './repositories/services';

import { 
  TaskRepository, 
  UserRepository, 
  ChurchRepository, 
  VerificationCodeRepository
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
  VerificationCode
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
  VerificationCode
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
      useClass: VerificationCode,
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
    VerificationCodeService
  ],
})
export class DataBaseModule { }
