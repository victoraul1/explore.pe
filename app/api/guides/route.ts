import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    
    let query: any = {};
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    
    const guides = await Guide.find(query).where('active').equals(true);
    
    return NextResponse.json({ guides });
  } catch (error) {
    console.error('Error fetching guides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guides' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, email, phone, location, youtubeEmbed, lat, lng, instagram, price } = body;
    
    const guide = await Guide.create({
      name,
      email,
      phone,
      location,
      youtubeEmbed,
      lat,
      lng,
      instagram,
      price,
      category: 'Guía turística'
    });
    
    return NextResponse.json({ guide }, { status: 201 });
  } catch (error) {
    console.error('Error creating guide:', error);
    return NextResponse.json(
      { error: 'Failed to create guide' },
      { status: 500 }
    );
  }
}