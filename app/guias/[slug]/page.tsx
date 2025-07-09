import { notFound } from 'next/navigation';
import ProfileView from '@/components/ProfileView';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import Review from '@/models/Review';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  
  await dbConnect();
  
  // Find guide by slug and ensure it's a guide type
  const guide = await Guide.findOne({ 
    slug, 
    userType: 'guide',
    active: true 
  }).lean();
  
  if (!guide) {
    notFound();
  }

  // Fetch reviews for this guide
  const reviews = await Review.find({ guideId: guide._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Convert MongoDB documents to plain objects
  const guideData = JSON.parse(JSON.stringify(guide));
  const reviewsData = JSON.parse(JSON.stringify(reviews));

  return (
    <ProfileView 
      guide={guideData} 
      reviews={reviewsData} 
      averageRating={averageRating} 
    />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await dbConnect();
  
  const guide = await Guide.findOne({ 
    slug, 
    userType: 'guide',
    active: true 
  }).lean();
  
  if (!guide) {
    return {
      title: 'Guía no encontrado',
    };
  }

  return {
    title: `${guide.name} - Guía Turístico en ${guide.location} | Explore.pe`,
    description: guide.services || `Conoce a ${guide.name}, guía turístico profesional en ${guide.location}, Perú.`,
  };
}