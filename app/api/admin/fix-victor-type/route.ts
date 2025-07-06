import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export async function GET() {
  try {
    await dbConnect();

    // Update Victor Galindo to be an explorer (tourist)
    const user = await Guide.findOneAndUpdate(
      { email: 'victorgalindo475@gmail.com' },
      { 
        $set: { 
          userType: 'explorer',
          // Clear guide-specific fields
          certificateNumber: undefined,
          phone: undefined
        }
      },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Victor Galindo updated to tourist/explorer type',
      user: {
        name: user.name,
        email: user.email,
        userType: user.userType,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Error updating user type:', error);
    return NextResponse.json(
      { error: 'Failed to update user type' },
      { status: 500 }
    );
  }
}