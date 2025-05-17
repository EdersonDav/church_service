import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { env } from '../../config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: env.mail.host,
        port: env.mail.port,
        secure: env.mail.secure, 
        auth: {
          user: env.mail.auth.user,
          pass: env.mail.auth.pass,
        },
      },
      defaults: {
        from: env.mail.defaults.from,
      },
      template: {
        dir:  join(process.cwd(), 'assets', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class MailModule {}
