import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../config';
import { UserService } from './repositories/services';
import { UserRepository } from './repositories/interfaces';
import { User } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.db.HOST,
      port: env.db.PORT,
      database: env.db.NAME,
      entities: [User],
      password: env.db.PASSWORD,
      username: env.db.USER,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([]),
  ],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: UserService,
    }
  ],
  exports: [
    UserRepository,
    UserService
  ],
})
export class DataBaseModule { }
