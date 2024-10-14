import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

/**
 * MailService is responsible for sending emails using the MailerService from @nestjs-modules/mailer.
 * It provides a sendEmail method that takes the recipient's email address, subject, and HTML content as parameters.
 * The method attempts to send the email using the MailerService and returns an object indicating the success status.
 * If the email is sent successfully, it returns { success: true }, otherwise it returns { success: false }.
 */
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, html: string): Promise<{success:boolean}> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
      }
    }
  }
}
