import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../config';
import { UserService, TaskService, ChurchService } from './repositories/services';
import { TaskRepository, UserRepository, ChurchRepository } from './repositories/interfaces';
import { Task, User, Church } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.db.HOST,
      port: env.db.PORT,
      database: env.db.NAME,
      entities: [User, Task, Church],
      password: env.db.PASSWORD,
      username: env.db.USER,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Task, Church]),
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
    }
  ],
  exports: [
    UserRepository,
    UserService,
    TaskRepository,
    TaskService,
    ChurchRepository,
    ChurchService
  ],
})
export class DataBaseModule { }
