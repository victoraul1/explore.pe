import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import Review from '@/models/Review';
import ProfileView from '@/components/ProfileView';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  await dbConnect();
  const guide = await Guide.findById(id).lean() as any;
  
  if (!guide) {
    return {
      title: 'Perfil no encontrado | Explore.pe',
    };
  }

  const userType = guide.userType === 'explorer' ? 'Turista' : 'Guía';
  
  return {
    title: `${guide.name} - ${userType} | Explore.pe`,
    description: guide.services || `Conoce a ${guide.name}, ${userType} en ${guide.location}`,
    openGraph: {
      title: `${guide.name} - ${userType} en Explore.pe`,
      description: guide.services || `Conoce a ${guide.name}, ${userType} en ${guide.location}`,
      url: `https://explore.pe/profile/${id}`,
      siteName: 'Explore.pe',
      locale: 'es_PE',
      type: 'profile',
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  
  await dbConnect();
  
  const guide = await Guide.findById(id).lean() as any;
  
  if (!guide) {
    notFound();
  }

  // Fetch reviews if it's a guide
  let reviews = [];
  let averageRating = 0;
  
  if (guide.userType === 'guide') {
    reviews = await Review.find({ guideId: id })
      .sort({ createdAt: -1 })
      .lean();
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / reviews.length;
    }
  }

  return (
    <ProfileView 
      guide={JSON.parse(JSON.stringify(guide))}
      reviews={JSON.parse(JSON.stringify(reviews))}
      averageRating={averageRating}
    />
  );
}