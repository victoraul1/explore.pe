'use client';

import { useState } from 'react';
import { IGuide } from '@/models/Guide';
import { IReview } from '@/models/Review';
import { MapPin, Star, Phone, MessageCircle, Instagram, Facebook, Share2, Globe, Camera, UserCircle2 } from 'lucide-react';
import ImageCarousel from '@/components/ImageCarousel';
import RatingForm from '@/components/RatingForm';
import { useSession } from 'next-auth/react';

interface ProfileViewProps {
  guide: IGuide;
  reviews: IReview[];
  averageRating: number;
}

export default function ProfileView({ guide, reviews, averageRating }: ProfileViewProps) {
  const { data: session } = useSession();
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [currentReviews, setCurrentReviews] = useState(reviews);
  
  const isExplorer = session?.user?.userType === 'explorer';
  const hasReviewed = currentReviews.some(review => review.explorerId === session?.user?.id);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Conoce a ${guide.name} en Explore.pe`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
    }
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = guide.whatsapp || guide.phone;
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  const handleReviewSubmit = (review: IReview) => {
    setCurrentReviews([review, ...currentReviews]);
    setShowRatingForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
                Explore.pe
              </a>
              <a href="/" className="text-gray-700 hover:text-gray-900">
                ← Volver al mapa
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                guide.userType === 'explorer' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {guide.userType === 'explorer' ? 'Turista' : 'Guía'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{guide.name}</h1>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{guide.location}</span>
                  </div>
                  {guide.locations && guide.locations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {guide.locations.map((loc, index) => (
                        <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                          {loc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Share buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                    title="Compartir en WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    title="Compartir en Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200"
                    title="Compartir en Twitter"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              {guide.userType === 'guide' && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(averageRating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {averageRating > 0 
                      ? `${averageRating.toFixed(1)} (${currentReviews.length} reseñas)`
                      : 'Sin reseñas aún'
                    }
                  </span>
                </div>
              )}

              {/* Certificate Number */}
              {guide.userType === 'guide' && guide.certificateNumber && (
                <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Certificado MINCETUR:</span> {guide.certificateNumber}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">
                  {guide.userType === 'guide' ? 'Servicios' : 'Mi experiencia'}
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">{guide.services}</p>
              </div>

              {/* Contact */}
              {guide.userType === 'guide' && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Contacto</h3>
                  <div className="space-y-2">
                    {guide.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{guide.phone}</span>
                      </div>
                    )}
                    {guide.whatsapp && (
                      <button
                        onClick={handleWhatsAppClick}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp: {guide.whatsapp}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Images */}
            {guide.images && guide.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Fotos</h2>
                <ImageCarousel images={guide.images} />
              </div>
            )}

            {/* YouTube Video */}
            {guide.youtubeEmbed && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Video</h2>
                <div className="aspect-video">
                  <iframe
                    src={guide.youtubeEmbed}
                    title={`Video de ${guide.name}`}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {guide.userType === 'guide' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Reseñas</h2>
                  {isExplorer && !hasReviewed && (
                    <button
                      onClick={() => setShowRatingForm(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Escribir reseña
                    </button>
                  )}
                </div>

                {showRatingForm && (
                  <RatingForm
                    guideId={guide._id!}
                    guideName={guide.name}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowRatingForm(false)}
                  />
                )}

                {currentReviews.length > 0 ? (
                  <div className="space-y-4">
                    {currentReviews.map((review) => (
                      <div key={review._id} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-medium">{review.explorerName}</span>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt!).toLocaleDateString('es-PE')}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No hay reseñas aún. {isExplorer && '¡Sé el primero en escribir una!'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">Ubicación</h3>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <Globe className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Mapa próximamente disponible
              </p>
            </div>

            {/* Social Media */}
            {(guide.instagram || guide.facebook) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-3">Redes Sociales</h3>
                <div className="space-y-2">
                  {guide.instagram && (
                    <a
                      href={`https://instagram.com/${guide.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>{guide.instagram}</span>
                    </a>
                  )}
                  {guide.facebook && (
                    <a
                      href={guide.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <Facebook className="w-4 h-4" />
                      <span>Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            Desarrollado por VRG Market Solutions | Todos los derechos reservados © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}