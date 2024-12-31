import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../config';
import { UserService, TaskService } from './repositories/services';
import { TaskRepository, UserRepository } from './repositories/interfaces';
import { Task, User } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.db.HOST,
      port: env.db.PORT,
      database: env.db.NAME,
      entities: [User, Task],
      password: env.db.PASSWORD,
      username: env.db.USER,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Task]),
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
    }
  ],
  exports: [
    UserRepository,
    UserService,
    TaskRepository,
    TaskService
  ],
})
export class DataBaseModule { }
