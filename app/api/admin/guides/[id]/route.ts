import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    
    // Don't allow deleting admin accounts
    const guideToDelete = await Guide.findById(id);
    if (!guideToDelete) {
      return NextResponse.json(
        { error: 'Guía no encontrada' },
        { status: 404 }
      );
    }
    
    if (guideToDelete.role === 'admin') {
      return NextResponse.json(
        { error: 'No se puede eliminar una cuenta de administrador' },
        { status: 400 }
      );
    }
    
    await Guide.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guide:', error);
    return NextResponse.json(
      { error: 'Error al eliminar guía' },
      { status: 500 }
    );
  }
}