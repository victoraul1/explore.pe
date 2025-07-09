import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export async function POST() {
  try {
    await dbConnect();
    
    // Update all guides without userType
    const result = await Guide.updateMany(
      { userType: { $exists: false } },
      { $set: { userType: 'guide' } }
    );
    
    // Also ensure role is set for guides
    const roleResult = await Guide.updateMany(
      { role: { $exists: false }, userType: 'guide' },
      { $set: { role: 'guide' } }
    );
    
    return NextResponse.json({ 
      message: 'Fixed userType and role fields',
      userTypeUpdated: result.modifiedCount,
      roleUpdated: roleResult.modifiedCount
    });
  } catch (error) {
    console.error('Error fixing userType:', error);
    return NextResponse.json(
      { error: 'Failed to fix userType' },
      { status: 500 }
    );
  }
}