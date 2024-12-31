import 'dotenv/config';
import { config } from 'dotenv';

config();

export const env = {
  api: {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
  },
  db: {
    HOST: process.env.DB_HOST,
    PORT: Number(process.env.DB_PORT),
    NAME: process.env.DB_NAME,
    PASSWORD: process.env.DB_PASSWORD,
    USER: process.env.DB_USER,
    SCHEMA: process.env.DB_SCHEMA,
  },
  jwtConstants: {
    secret: process.env.SECRET,
    expiresIn: '1h'
  },
  bcrypt: {
    saltRounds: 10
  }
};
