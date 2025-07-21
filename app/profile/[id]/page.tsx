import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import Review from '@/models/Review';
import ProfileView from '@/components/ProfileView';
import type { Metadata } from 'next';
import { Client } from '@googlemaps/google-maps-services-js';

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
  let reviews: any[] = [];
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

  // Geocode places visited for tourists
  let visitedLocations: Array<{ name: string; lat: number; lng: number; }> = [];
  if (guide.userType === 'explorer' && guide.placesVisited && guide.placesVisited.length > 0) {
    const client = new Client({});
    
    const geocodedLocations = await Promise.all(
      guide.placesVisited.map(async (place: string) => {
        try {
          const response = await client.geocode({
            params: {
              address: `${place}, Peru`,
              key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            },
          });
          
          if (response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
              name: place,
              lat: location.lat,
              lng: location.lng,
            };
          }
        } catch (error) {
          console.error(`Error geocoding ${place}:`, error);
        }
        return null;
      })
    );
    
    // Filter out failed geocoding attempts
    visitedLocations = geocodedLocations.filter((loc): loc is { name: string; lat: number; lng: number; } => loc !== null);
  }

  return (
    <ProfileView 
      guide={JSON.parse(JSON.stringify(guide))}
      reviews={JSON.parse(JSON.stringify(reviews))}
      averageRating={averageRating}
      visitedLocations={visitedLocations}
    />
  );
}