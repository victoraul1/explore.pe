import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true, // Enable debug output
  logger: true, // Log to console
});

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;
  
  const mailOptions = {
    from: `"Explore.pe - No Reply" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verifica tu cuenta en Explore.pe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">¡Bienvenido a Explore.pe!</h1>
        
        <p>Hola ${name},</p>
        
        <p>Gracias por registrarte como guía turístico en Explore.pe. Para completar tu registro y activar tu perfil, por favor verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #10b981; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verificar mi cuenta
          </a>
        </div>
        
        <p>O copia y pega este enlace en tu navegador:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        
        <p>Este enlace expirará en 24 horas por seguridad.</p>
        
        <p>Si no creaste una cuenta en Explore.pe, puedes ignorar este mensaje.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
        <p style="color: #666; font-size: 14px; text-align: center;">
          Explore.pe - Conectando turistas con guías locales en Perú
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"Explore.pe - No Reply" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Restablecer contraseña - Explore.pe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Restablecer Contraseña</h1>
        
        <p>Hola ${name},</p>
        
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Explore.pe.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #3b82f6; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Restablecer mi contraseña
          </a>
        </div>
        
        <p>O copia y pega este enlace en tu navegador:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        
        <p>Este enlace expirará en 1 hora por seguridad.</p>
        
        <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
        <p style="color: #666; font-size: 14px; text-align: center;">
          Explore.pe - Conectando turistas con guías locales en Perú
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}