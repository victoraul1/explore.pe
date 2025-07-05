import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import { Client } from '@googlemaps/google-maps-services-js';

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
    const { name, email, phone, location, youtubeEmbed, instagram, price } = body;
    
    // Initialize Google Maps client
    const client = new Client({});
    
    let lat = -12.0464; // Default Lima coordinates
    let lng = -77.0428;
    
    try {
      // Geocode the address to get coordinates
      const geocodeResponse = await client.geocode({
        params: {
          address: location + ', Peru',
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        },
      });
      
      if (geocodeResponse.data.results.length > 0) {
        const result = geocodeResponse.data.results[0];
        lat = result.geometry.location.lat;
        lng = result.geometry.location.lng;
        console.log(`Geocoded ${location} to coordinates: ${lat}, ${lng}`);
      } else {
        console.warn(`Could not geocode address: ${location}`);
      }
    } catch (geocodeError) {
      console.error('Geocoding error:', geocodeError);
      // Use default coordinates if geocoding fails
    }
    
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