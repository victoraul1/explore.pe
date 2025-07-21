import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import { slugify } from '@/lib/slugify';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const guide = await Guide.findOne({ email: session.user.email });
    
    if (!guide) {
      return NextResponse.json(
        { error: 'Guía no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ guide });
  } catch (error) {
    console.error('Error fetching guide:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del guía' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    const { name, phone, whatsapp, location, instagram, facebook, services, country, placesVisited, images, certificateNumber } = body;
    
    // Get current guide to check if name is changing
    const currentGuide = await Guide.findOne({ email: session.user.email });
    if (!currentGuide) {
      return NextResponse.json(
        { error: 'Guía no encontrado' },
        { status: 404 }
      );
    }
    
    const updateData: any = {
      name,
      phone,
      whatsapp,
      location,
      instagram,
      facebook,
      services,
      certificateNumber
    };
    
    // Add images if provided
    if (images !== undefined) {
      updateData.images = images;
    }
    
    // Add tourist-specific fields
    if (currentGuide.userType === 'explorer') {
      if (country) updateData.country = country;
      if (placesVisited) updateData.placesVisited = placesVisited;
    }
    
    // Generate new slug if name changed
    if (name && name !== currentGuide.name) {
      let baseSlug = slugify(name);
      let slug = baseSlug;
      let counter = 1;
      
      // Check if slug already exists and make it unique
      while (await Guide.findOne({ slug, _id: { $ne: currentGuide._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      // For tourists, append country to slug if provided
      if (currentGuide.userType === 'explorer' && (country || currentGuide.country)) {
        const countrySlug = slugify(country || currentGuide.country);
        slug = `${slug}-${countrySlug}`;
      }
      
      updateData.slug = slug;
    }
    
    const guide = await Guide.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    );

    return NextResponse.json({ guide });
  } catch (error) {
    console.error('Error updating guide:', error);
    return NextResponse.json(
      { error: 'Error al actualizar datos del guía' },
      { status: 500 }
    );
  }
}