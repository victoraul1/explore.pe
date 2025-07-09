import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import { Client } from '@googlemaps/google-maps-services-js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { slugify } from '@/lib/slugify';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    
    let query: any = {};
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    
    const guides = await Guide.find(query)
      .where('active').equals(true)
      .where('role').ne('admin')
      .where('email').ne('info@explore.pe'); // Also exclude by email to be sure
    
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
    const { name, email, password, phone, whatsapp, location, youtubeEmbed, instagram, facebook, services, userType, category, locations, country } = body;

    // Check if guide already exists
    const existingGuide = await Guide.findOne({ email });
    if (existingGuide) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Initialize coordinates
    let lat = -12.0464; // Default Lima coordinates
    let lng = -77.0428;
    
    // Only geocode for guides (they need exact location)
    if (userType === 'guide') {
      const client = new Client({});
      
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
    }
    
    // Generate unique slug
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug already exists and make it unique
    while (await Guide.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    // For tourists, append country to slug if provided
    if (userType === 'explorer' && country) {
      const countrySlug = slugify(country);
      slug = `${slug}-${countrySlug}`;
    }
    
    const guide = await Guide.create({
      name,
      email,
      password: hashedPassword,
      phone: userType === 'guide' ? phone : undefined,
      whatsapp: userType === 'guide' ? whatsapp : undefined,
      location: userType === 'explorer' && locations?.length > 0 ? locations[0] : location,
      locations: userType === 'explorer' ? locations : undefined,
      country: userType === 'explorer' ? country : undefined,
      slug,
      youtubeEmbed: youtubeEmbed || undefined,
      lat,
      lng,
      instagram: userType === 'guide' ? instagram : undefined,
      facebook: userType === 'guide' ? facebook : undefined,
      services: services || undefined,
      category: category || 'Guía turística',
      userType: userType || 'guide',
      emailVerified: false,
      verificationToken
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, name, verificationToken);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Continue with registration even if email fails
    }
    
    return NextResponse.json({ guide }, { status: 201 });
  } catch (error) {
    console.error('Error creating guide:', error);
    return NextResponse.json(
      { error: 'Failed to create guide' },
      { status: 500 }
    );
  }
}