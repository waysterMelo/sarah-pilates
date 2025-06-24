import { transporter, emailTemplates } from '../config/email';

export class EmailService {
  static async sendEmail(to: string, subject: string, html: string) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Falha ao enviar email');
    }
  }

  static async sendAppointmentConfirmation(
    studentEmail: string, 
    studentName: string, 
    date: string, 
    time: string
  ) {
    const template = emailTemplates.appointmentConfirmation(studentName, date, time);
    await this.sendEmail(studentEmail, template.subject, template.html);
  }

  static async sendAppointmentReminder(
    studentEmail: string, 
    studentName: string, 
    date: string, 
    time: string
  ) {
    const template = emailTemplates.appointmentReminder(studentName, date, time);
    await this.sendEmail(studentEmail, template.subject, template.html);
  }

  static async sendPasswordReset(name: string, email: string, resetLink: string) {
    const template = emailTemplates.passwordReset(name, resetLink);
    await this.sendEmail(email, template.subject, template.html);
  }
}