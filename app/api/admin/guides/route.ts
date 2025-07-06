import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
    
    // Check if user is admin
    const adminUser = await Guide.findOne({ email: session.user.email });
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }
    
    // Get all guides
    const guides = await Guide.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ guides });
  } catch (error) {
    console.error('Error fetching guides:', error);
    return NextResponse.json(
      { error: 'Error al obtener guías' },
      { status: 500 }
    );
  }
}