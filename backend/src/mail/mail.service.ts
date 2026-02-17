import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(configService.get("RESEND_API_KEY"));
  }

  async sendWelcomeEmail(email: string, name: string, tempPassword: string) {
    const content = `
      <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bem-vindo ao TAB</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Poppins', sans-serif; background-color: #0a0a0a; color: #ffffff;">
            
            <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #262626;">
                
                <div style="padding: 40px 32px; border-bottom: 1px solid #262626; text-align: left;">
                    <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">
                        TAB<span style="color: #F25F4C;">.</span>
                    </h1>
                    <p style="color: #a3a3a3; margin: 0; font-size: 16px; font-weight: 400; line-height: 1.6;">
                        Seu acesso à plataforma de gestão chegou.
                    </p>
                </div>

                <div style="padding: 40px 32px;">
                    
                    <h2 style="margin: 0 0 16px 0; color: #ffffff; font-size: 20px; font-weight: 600;">
                        Olá, ${name}!
                    </h2>
                    <p style="margin: 0 0 32px 0; color: #a3a3a3; font-size: 15px; line-height: 1.6;">
                        Você foi adicionado à equipe do restaurante. Abaixo estão suas credenciais exclusivas para acessar o painel e começar a gerenciar seus pedidos.
                    </p>

                    <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                        <div style="margin-bottom: 16px;">
                            <span style="color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">E-mail de acesso</span>
                            <p style="margin: 4px 0 0 0; color: #ffffff; font-size: 16px; font-family: 'JetBrains Mono', monospace;">${email}</p>
                        </div>
                        <div>
                            <span style="color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Senha Temporária</span>
                            <p style="margin: 4px 0 0 0; color: #F25F4C; font-size: 24px; font-weight: 700; letter-spacing: 2px; font-family: 'JetBrains Mono', monospace;">${tempPassword}</p>
                        </div>
                    </div>

                    <div style="background-color: rgba(242, 95, 76, 0.1); border-left: 4px solid #F25F4C; padding: 16px; margin-bottom: 32px; border-radius: 4px;">
                        <p style="margin: 0; color: #d4d4d4; font-size: 14px; line-height: 1.5;">
                            <strong>Importante:</strong> Por questões de segurança, você será solicitado a alterar esta senha no seu primeiro login.
                        </p>
                    </div>

                    <div style="text-align: center; margin: 40px 0;">
                        <a href="https://tab.raulc.dev/login" 
                          style="display: inline-block; background-color: #F25F4C; color: #ffffff; padding: 16px 48px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            Acessar o TAB
                        </a>
                    </div>

                </div>

                <div style="background-color: #111111; padding: 32px; text-align: center; border-top: 1px solid #262626;">
                    <p style="margin: 0 0 8px 0; color: #737373; font-size: 12px;">
                        Este é um e-mail automático enviado pelo sistema TAB.
                    </p>
                    <p style="margin: 0; color: #525252; font-size: 11px;">
                        &copy; 2026 TAB Gestão Inteligente. João Pessoa, PB.
                    </p>
                </div>

            </div>

        </body>
      </html>
    `;

    try {
      console.log({
        message: "Enviando email via resend.",
        email,
        name,
        tempPassword,
        api_key: this.configService.get("RESEND_API_KEY"),
      });

      const { data, error } = await this.resend.emails.send({
        from: "TAB App <onboarding@resend.dev>",
        to: [email],
        subject: "Bem-vindo(a) ao TAB! Seu acesso chegou.",
        html: content,
      });

      if (error) {
        console.error("[MailService] Erro retornado pelo Resend:", error);
        return;
      }
    } catch (e) {
      console.log({
        message:
          "An unknown error has occured while trying to send the welcome email.",
        error: e,
      });
    }
  }
}
