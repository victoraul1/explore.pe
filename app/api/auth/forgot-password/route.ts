import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find user by email
    const user = await Guide.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: 'Si existe una cuenta con este correo, recibirás instrucciones para restablecer tu contraseña.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save reset token and expiry
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Generate reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'https://explore.pe'}/reset-password?token=${resetToken}`;
    
    // Log the reset URL for debugging
    console.log(`Password reset URL for ${email}: ${resetUrl}`);

    // Send email with timeout
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email timeout')), 10000); // 10 second timeout
      });

      // Race between email sending and timeout
      await Promise.race([
        sendPasswordResetEmail(email, user.name, resetToken),
        timeoutPromise
      ]);
      console.log('Password reset email sent successfully');
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Store the reset URL in a field for manual retrieval if needed
      console.log(`Manual reset URL: ${resetUrl}`);
      // Still return success to prevent information disclosure
    }

    return NextResponse.json(
      { message: 'Si existe una cuenta con este correo, recibirás instrucciones para restablecer tu contraseña.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}