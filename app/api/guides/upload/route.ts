import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Get guide to check current image count
    const guide = await Guide.findOne({ email: session.user.email });
    if (!guide) {
      return NextResponse.json(
        { error: 'Guía no encontrado' },
        { status: 404 }
      );
    }

    const currentImageCount = guide.images?.length || 0;
    const maxImages = guide.userType === 'explorer' ? 50 : 20;
    
    if (currentImageCount >= maxImages) {
      return NextResponse.json(
        { error: `Máximo ${maxImages} imágenes permitidas` },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se encontró archivo' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no válido. Use JPG, PNG o WebP' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es muy grande. Máximo 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.name);
    const filename = `${guide._id}-${uniqueSuffix}${ext}`;
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'guides');
    await mkdir(uploadDir, { recursive: true });
    
    // Save file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    
    // Update guide with new image
    const imageUrl = `/uploads/guides/${filename}`;
    guide.images = guide.images || [];
    guide.images.push(imageUrl);
    await guide.save();

    return NextResponse.json({ 
      url: imageUrl,
      images: guide.images 
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL de imagen requerida' },
        { status: 400 }
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

    // Remove image from array
    guide.images = guide.images?.filter((img: string) => img !== imageUrl) || [];
    await guide.save();

    // Note: We're not deleting the actual file to avoid issues if it's referenced elsewhere
    // In production, you might want to implement a cleanup job

    return NextResponse.json({ 
      success: true,
      images: guide.images 
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Error al eliminar imagen' },
      { status: 500 }
    );
  }
}