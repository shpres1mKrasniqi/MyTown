using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Application.Settings;


namespace MyTown.Infrastructure.Repositories
{
    public class SmtpEmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public SmtpEmailService(IOptions<EmailSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendPasswordResetCodeAsync(string toEmail, string firstName, string code)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            message.To.Add(new MailboxAddress(firstName, toEmail));
            message.Subject = "Kodi juaj për ndryshimin e fjalëkalimit";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = BuildEmailHtml(firstName, code),
                TextBody = $"Përshëndetje {firstName},\nKodi juaj është: {code}\n\nKy kod është i vlefshëm për {_settings.ResetCodeExpirationMinutes} minuta.\n\nNëse nuk e keni kërkuar këtë, injoroni këtë email."
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_settings.SmtpHost, _settings.SmtpPort, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_settings.SenderEmail, _settings.AppPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }

        private string BuildEmailHtml(string firstName, string code) => $"""
            <!DOCTYPE html>
            <html lang="sq">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:40px 20px;">
                    <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
                      <tr>
                        <td style="background:#1a56db;padding:28px 32px;">
                          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">MyTown</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:32px;">
                          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Përshëndetje, <strong>{firstName}</strong>,</p>
                          <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
                            Kemi marrë një kërkesë për rivendosjen e fjalëkalimit të llogarisë suaj.
                            Përdorni kodin e mëposhtëm:
                          </p>
                          <div style="text-align:center;margin:0 0 24px;">
                            <span style="display:inline-block;background:#f0f4ff;border:1px solid #c7d7fd;border-radius:8px;padding:14px 36px;font-size:32px;font-weight:700;letter-spacing:10px;color:#1a56db;">{code}</span>
                          </div>
                          <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">
                            Ky kod është i vlefshëm për <strong>{_settings.ResetCodeExpirationMinutes} minuta</strong>.
                          </p>
                          <p style="margin:0;font-size:14px;color:#6b7280;">
                            Nëse nuk e keni kërkuar këtë, injoroni këtë email. Llogaria juaj është e sigurt.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
                          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                            © {DateTime.UtcNow.Year} MyTown · Ky është një email automatik, ju lutem mos ktheni përgjigje.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """;
    }
}