import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import { injectable } from 'tsyringe';

import { IMailProvider } from '../IMailProvider';

@injectable()
class MailTrapProvider implements IMailProvider {
  private client: Transporter;
  constructor() {
    this.client = nodemailer.createTransport({
      host: process.env.HOST_MAILTRAP,
      port: Number(process.env.PORT_MAILTRAP),
      auth: {
        user: process.env.AUTH_USER_MAILTRAP,
        pass: process.env.PASS_USER_MAILTRAP,
      },
    });
  }
  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path, { encoding: 'utf-8' });

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    const message = await this.client.sendMail({
      to,
      from: 'Rentx <noreplay@rentx.com.br',
      subject,
      html: templateHTML,
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export { MailTrapProvider };
