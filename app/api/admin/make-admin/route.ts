import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Make the current user an admin
    const result = await Guide.findOneAndUpdate(
      { email: session.user.email },
      { $set: { role: 'admin' } },
      { new: true }
    );
    
    if (!result) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'User is now an admin',
      user: {
        name: result.name,
        email: result.email,
        role: result.role
      }
    });
  } catch (error) {
    console.error('Error making user admin:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}