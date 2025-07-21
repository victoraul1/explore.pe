import { notFound } from 'next/navigation';
import ProfileView from '@/components/ProfileView';
import dbConnect from '@/lib/mongodb';
import Guide, { IGuide } from '@/models/Guide';
import Review from '@/models/Review';
import { Client } from '@googlemaps/google-maps-services-js';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TouristPage({ params }: PageProps) {
  const { slug } = await params;
  
  await dbConnect();
  
  // Find tourist by slug and ensure it's an explorer type
  const tourist = await Guide.findOne({ 
    slug, 
    userType: 'explorer',
    active: true 
  }).lean() as IGuide | null;
  
  if (!tourist) {
    notFound();
  }

  // Fetch reviews for this tourist (if any)
  const reviews = await Review.find({ guideId: tourist._id?.toString() || '' })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Geocode places visited
  let visitedLocations = [];
  if (tourist.placesVisited && tourist.placesVisited.length > 0) {
    const client = new Client({});
    
    visitedLocations = await Promise.all(
      tourist.placesVisited.map(async (place) => {
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
    visitedLocations = visitedLocations.filter(loc => loc !== null);
  }

  // Convert MongoDB documents to plain objects
  const touristData = JSON.parse(JSON.stringify(tourist));
  const reviewsData = JSON.parse(JSON.stringify(reviews));

  return (
    <ProfileView 
      guide={touristData} 
      reviews={reviewsData} 
      averageRating={averageRating}
      visitedLocations={visitedLocations}
    />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await dbConnect();
  
  const tourist = await Guide.findOne({ 
    slug, 
    userType: 'explorer',
    active: true 
  }).lean() as IGuide | null;
  
  if (!tourist) {
    return {
      title: 'Turista no encontrado',
    };
  }

  const country = tourist.country ? ` de ${tourist.country}` : '';
  
  return {
    title: `${tourist.name}${country} - Turista | Explore.pe`,
    description: tourist.services || `Conoce a ${tourist.name}, turista${country} explorando Perú.`,
  };
}