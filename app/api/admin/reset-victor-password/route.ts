import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();

    // Find Victor Galindo
    const user = await Guide.findOne({ name: 'Victor Galindo' });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User Victor Galindo not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash('nicolas', 12);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated for Victor Galindo',
      email: user.email,
      note: 'New password is: nicolas'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}