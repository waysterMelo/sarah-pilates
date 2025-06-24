import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const emailTemplates = {
  appointmentConfirmation: (studentName: string, date: string, time: string) => ({
    subject: 'Confirmação de Agendamento - Sarah Pilates',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6C5CE7;">Sarah Pilates - Confirmação de Agendamento</h2>
        <p>Olá <strong>${studentName}</strong>,</p>
        <p>Seu agendamento foi confirmado com sucesso!</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Data:</strong> ${date}</p>
          <p><strong>Horário:</strong> ${time}</p>
        </div>
        <p>Lembre-se de chegar com 10 minutos de antecedência.</p>
        <p>Atenciosamente,<br>Equipe Sarah Pilates</p>
      </div>
    `,
  }),

  appointmentReminder: (studentName: string, date: string, time: string) => ({
    subject: 'Lembrete de Aula - Sarah Pilates',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6C5CE7;">Sarah Pilates - Lembrete de Aula</h2>
        <p>Olá <strong>${studentName}</strong>,</p>
        <p>Este é um lembrete de que você tem uma aula agendada para amanhã:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Data:</strong> ${date}</p>
          <p><strong>Horário:</strong> ${time}</p>
        </div>
        <p>Nos vemos em breve!</p>
        <p>Atenciosamente,<br>Equipe Sarah Pilates</p>
      </div>
    `,
  }),

  passwordReset: (name: string, resetLink: string) => ({
    subject: 'Redefinir Senha - Sarah Pilates',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6C5CE7;">Sarah Pilates - Redefinir Senha</h2>
        <p>Olá <strong>${name}</strong>,</p>
        <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #6C5CE7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Redefinir Senha
          </a>
        </div>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou esta alteração, ignore este email.</p>
        <p>Atenciosamente,<br>Equipe Sarah Pilates</p>
      </div>
    `,
  }),
};