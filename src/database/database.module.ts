import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.db.HOST,
      port: env.db.PORT,
      database: env.db.NAME,
      entities: [],
      password: env.db.PASSWORD,
      username: env.db.USER,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([]),
  ],
  providers: [
  ],
  exports: [
  ],
})
export class DataBaseModule { }
