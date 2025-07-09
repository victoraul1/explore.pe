import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await dbConnect();
    
    // Find or create the admin user
    let admin = await Guide.findOne({ email: 'info@explore.pe' });
    
    if (!admin) {
      // Create admin user if it doesn't exist
      const hashedPassword = await bcrypt.hash('Nicolas#77', 10);
      
      admin = await Guide.create({
        name: 'Administrator',
        email: 'info@explore.pe',
        password: hashedPassword,
        location: 'Lima, Peru',
        lat: -12.0464,
        lng: -77.0428,
        youtubeEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        category: 'Admin',
        userType: 'guide',
        role: 'admin',
        active: true,
        emailVerified: true,
        phone: '000000000'
      });
      
      return NextResponse.json({ 
        message: 'Admin user created successfully',
        email: admin.email
      });
    } else {
      // Update existing admin password
      const hashedPassword = await bcrypt.hash('Nicolas#77', 10);
      
      await Guide.findByIdAndUpdate(admin._id, {
        password: hashedPassword,
        role: 'admin',
        emailVerified: true,
        active: true
      });
      
      return NextResponse.json({ 
        message: 'Admin password updated successfully',
        email: admin.email
      });
    }
  } catch (error) {
    console.error('Error setting up admin:', error);
    return NextResponse.json(
      { error: 'Failed to setup admin' },
      { status: 500 }
    );
  }
}