import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

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
    const { name, phone, whatsapp, location, instagram, facebook, services, price } = body;
    
    const guide = await Guide.findOneAndUpdate(
      { email: session.user.email },
      {
        name,
        phone,
        whatsapp,
        location,
        instagram,
        facebook,
        services,
        price
      },
      { new: true }
    );
    
    if (!guide) {
      return NextResponse.json(
        { error: 'Guía no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ guide });
  } catch (error) {
    console.error('Error updating guide:', error);
    return NextResponse.json(
      { error: 'Error al actualizar datos del guía' },
      { status: 500 }
    );
  }
}