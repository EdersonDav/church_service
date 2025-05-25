import 'dotenv/config';
import { config } from 'dotenv';

config();

export const env = {
  app_name: process.env.APP_NAME,
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
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    from: process.env.MAIL_FROM,
    reset_password_url: process.env.RESET_PASSWORD_URL || "",
  },
  codes_expired_in: {
    verification_code: 10,
    password_reset_code: 60,
  }
};
