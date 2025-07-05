import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Get all guides without passwords
    const guides = await Guide.find({ 
      $or: [
        { password: { $exists: false } },
        { password: null }
      ]
    });

    const updateResults = [];
    
    for (const guide of guides) {
      // Generate email from first name
      const firstName = guide.name.split(' ')[0].toLowerCase();
      const email = `${firstName}@explore.pe`;
      
      // Hash password
      const hashedPassword = await bcrypt.hash('password', 10);
      
      // Update guide
      try {
        await Guide.findByIdAndUpdate(guide._id, {
          email: email,
          password: hashedPassword,
          emailVerified: true, // Mark as verified since these are dummy accounts
          price: 30 // Set standard price to 30 soles per hour
        });
        
        updateResults.push({
          name: guide.name,
          email: email,
          status: 'success'
        });
      } catch (error) {
        updateResults.push({
          name: guide.name,
          email: email,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({ 
      message: 'Guides updated successfully',
      results: updateResults,
      total: guides.length
    });
    
  } catch (error) {
    console.error('Error updating guides:', error);
    return NextResponse.json(
      { error: 'Failed to update guides' },
      { status: 500 }
    );
  }
}