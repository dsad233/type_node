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
        subject: '이메일 인증 코드를 보내드려요',
        html: `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0;padding:0;background-color:#f4f7fb;">
          <tr>
            <td align="center" style="padding:40px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;background-color:#ffffff;border-radius:24px;">
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#2563eb,#7c3aed);border-top-left-radius:24px;border-top-right-radius:24px;">
                      <tr>
                        <td style="padding:28px 32px;">
                          <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,0.18);color:#ffffff;font-size:12px;font-weight:700;">
                            COMMUNITY HUB
                          </div>
                          <div style="margin-top:18px;color:#ffffff;font-size:28px;font-weight:800;line-height:1.3;">
                            이메일 인증 코드를 보내드렸어요
                          </div>
                          <div style="margin-top:8px;color:rgba(255,255,255,0.88);font-size:15px;line-height:1.7;">
                            비밀번호 변경을 진행하시려면 아래 인증 코드를 입력해주세요.
                          </div>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:32px;">
                          <div style="margin:0 0 16px;color:#111827;font-size:16px;line-height:1.8;">
                            안녕하세요.<br />
                            아래 인증 코드를 입력하면 이메일 인증을 완료할 수 있어요.
                          </div>

                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;background-color:#f8fafc;border:1px solid #e5e7eb;border-radius:20px;">
                            <tr>
                              <td align="center" style="padding:24px;">
                                <div style="margin-bottom:10px;color:#6b7280;font-size:13px;font-weight:600;">
                                  이메일 인증 코드
                                </div>
                                <div style="color:#111827;font-size:36px;font-weight:800;letter-spacing:0.22em;line-height:1.2;">
                                  ${constant}
                                </div>
                              </td>
                            </tr>
                          </table>

                          <div style="margin:0;color:#6b7280;font-size:14px;line-height:1.8;">
                            인증 코드는 일정 시간이 지나면 만료될 수 있으니 가능한 빨리 입력해주세요.
                          </div>

                          <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;line-height:1.7;">
                            본 메일은 발신 전용입니다. 요청하지 않은 메일이라면 무시하셔도 됩니다.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
      });

      return;
    }

    await transporter.sendMail({
      from: MAIL_USER,
      to: email,
      subject: '이메일 인증을 완료해주세요',
      html: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0;padding:0;background-color:#f4f7fb;">
        <tr>
          <td align="center" style="padding:40px 16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;background-color:#ffffff;border-radius:24px;">
              <tr>
                <td style="padding:0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#2563eb,#7c3aed);border-top-left-radius:24px;border-top-right-radius:24px;">
                    <tr>
                      <td style="padding:28px 32px;">
                        <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,0.18);color:#ffffff;font-size:12px;font-weight:700;">
                          COMMUNITY HUB
                        </div>
                        <div style="margin-top:18px;color:#ffffff;font-size:28px;font-weight:800;line-height:1.3;">
                          이메일 인증을 완료해주세요
                        </div>
                        <div style="margin-top:8px;color:rgba(255,255,255,0.88);font-size:15px;line-height:1.7;">
                          아래 버튼을 눌러 인증을 완료하면 회원가입을 마무리할 수 있어요.
                        </div>
                      </td>
                    </tr>
                  </table>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding:32px;">
                        <div style="margin:0 0 16px;color:#111827;font-size:16px;line-height:1.8;">
                          안녕하세요.<br />
                          아래 버튼을 눌러 이메일 인증을 완료해주세요.
                        </div>

                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px auto;">
                          <tr>
                            <td align="center" bgcolor="#111827" style="border-radius:14px;">
                              <a
                                href="http://localhost:3000/auth/verify?email=${encodeURIComponent(email)}"
                                style="display:inline-block;padding:16px 28px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;"
                              >
                                이메일 인증하기
                              </a>
                            </td>
                          </tr>
                        </table>

                        <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;line-height:1.7;">
                          본 메일은 발신 전용입니다. 요청하지 않은 메일이라면 무시하셔도 됩니다.
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    });
  }
}
