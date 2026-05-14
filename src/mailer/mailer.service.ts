import nodemailer from 'nodemailer';
import { MAIL_PASS, MAIL_USER } from '../common/configs/keys';

export class MailerService {
  async send(email: string, constant: number | null) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    // 인증 코드가 있을 시, 인증 코드 양식을 전송
    if (constant) {
      await transporter.sendMail({
        from: MAIL_USER,
        to: email,
        subject: '회원 가입을 환영합니다.',
        text: `여기 >> ${constant} << 코드가 있어요`,
      });

      return;
    }

    await transporter.sendMail({
      from: MAIL_USER,
      to: email,
      subject: '회원 가입을 환영합니다.',
      html: `<a href="http://localhost:3000/auth/verify?email=${email}">이메일 인증</a>`,
    });
  }
}
