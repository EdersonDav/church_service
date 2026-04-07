import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { env } from '../config';

export const ApiDataSource = new DataSource({
  type: 'postgres',
  logging: true,
  host: env.db.HOST,
  port: env.db.PORT,
  database: env.db.NAME,
  entities: [resolve(__dirname, 'entities', '*{.ts,.js}')],
  migrations: [resolve(__dirname, 'migrations', '*{.ts,.js}')],
  password: env.db.PASSWORD,
  username: env.db.USER,
  schema: env.db.SCHEMA,
  synchronize: true,
  uuidExtension: 'uuid-ossp',
});
