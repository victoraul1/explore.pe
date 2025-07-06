import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import Review from '@/models/Review';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Check if user is an explorer
    const explorer = await Guide.findOne({ email: session.user.email });
    if (!explorer || explorer.userType !== 'explorer') {
      return NextResponse.json(
        { error: 'Solo los exploradores pueden dejar reseñas' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { guideId, rating, comment } = body;
    
    // Validate input
    if (!guideId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La calificación debe estar entre 1 y 5' },
        { status: 400 }
      );
    }
    
    if (comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'El comentario debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }
    
    // Check if guide exists and is a guide
    const guide = await Guide.findById(guideId);
    if (!guide || guide.userType !== 'guide') {
      return NextResponse.json(
        { error: 'Guía no encontrado' },
        { status: 404 }
      );
    }
    
    // Check if explorer has already reviewed this guide
    const existingReview = await Review.findOne({
      guideId,
      explorerId: explorer._id.toString()
    });
    
    if (existingReview) {
      return NextResponse.json(
        { error: 'Ya has reseñado a este guía' },
        { status: 400 }
      );
    }
    
    // Create review
    const review = await Review.create({
      guideId,
      explorerId: explorer._id.toString(),
      explorerName: explorer.name,
      rating,
      comment: comment.trim()
    });
    
    // Update guide's average rating
    const reviews = await Review.find({ guideId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await Guide.findByIdAndUpdate(guideId, {
      rating: {
        stars: averageRating,
        count: reviews.length
      }
    });
    
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Error al crear reseña' },
      { status: 500 }
    );
  }
}