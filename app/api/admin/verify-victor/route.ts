import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export async function GET() {
  try {
    await dbConnect();

    // Find Victor Galindo and verify his email
    const user = await Guide.findOne({ email: 'victorgalindo475@gmail.com' });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update email verification status
    user.emailVerified = true;
    user.verificationToken = undefined; // Clear any existing token
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully for Victor Galindo',
      email: user.email,
      emailVerified: user.emailVerified
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}