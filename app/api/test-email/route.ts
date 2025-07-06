import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Create transporter with debug
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true,
      logger: true,
    });

    // Verify connection
    await transporter.verify();
    
    // Send test email
    const info = await transporter.sendMail({
      from: `"Explore.pe Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to yourself
      subject: 'Test Email - Explore.pe',
      text: 'This is a test email from Explore.pe',
      html: '<b>This is a test email from Explore.pe</b>',
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
      smtp_user: process.env.SMTP_USER,
    });
  } catch (error: any) {
    console.error('Email test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.response || error,
      smtp_user: process.env.SMTP_USER,
      smtp_host: process.env.SMTP_HOST,
    }, { status: 500 });
  }
}