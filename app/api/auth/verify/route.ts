import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find guide with this verification token
    const guide = await Guide.findOne({ 
      verificationToken: token,
      emailVerified: false 
    });

    if (!guide) {
      return NextResponse.json(
        { error: 'Token de verificación inválido o expirado' },
        { status: 400 }
      );
    }

    // Update guide as verified
    guide.emailVerified = true;
    guide.verificationToken = undefined; // Remove token after use
    await guide.save();

    return NextResponse.json({ 
      message: 'Email verificado exitosamente',
      success: true 
    });

  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Error al verificar el email' },
      { status: 500 }
    );
  }
}