import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Check if admin already exists
    const existingAdmin = await Guide.findOne({ email: 'info@explore.pe' });
    if (existingAdmin) {
      // Update existing user to admin
      const hashedPassword = await bcrypt.hash('.Nicolas#77a', 10);
      
      await Guide.findByIdAndUpdate(existingAdmin._id, {
        role: 'admin',
        password: hashedPassword,
        emailVerified: true,
        active: true
      });
      
      return NextResponse.json({ 
        message: 'Admin user updated successfully',
        email: 'info@explore.pe'
      });
    }
    
    // Create new admin user
    const hashedPassword = await bcrypt.hash('.Nicolas#77a', 10);
    
    const admin = await Guide.create({
      name: 'Administrator',
      email: 'info@explore.pe',
      password: hashedPassword,
      phone: '000000000',
      location: 'Lima, Peru',
      youtubeEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      lat: -12.0464,
      lng: -77.0428,
      category: 'Admin',
      role: 'admin',
      emailVerified: true,
      active: true
    });
    
    return NextResponse.json({ 
      message: 'Admin user created successfully',
      email: admin.email
    });
    
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}