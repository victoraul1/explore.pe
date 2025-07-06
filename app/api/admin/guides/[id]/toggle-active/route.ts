import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const { active } = await request.json();
    
    await Guide.findByIdAndUpdate(params.id, { active });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling guide status:', error);
    return NextResponse.json(
      { error: 'Error al actualizar estado' },
      { status: 500 }
    );
  }
}