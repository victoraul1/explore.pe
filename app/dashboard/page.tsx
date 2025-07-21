'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  MessageCircle,
  FileText,
  LogOut,
  Save,
  AlertCircle,
  Upload,
  X,
  Image as ImageIcon,
  Edit2
} from 'lucide-react';
import { IImage } from '@/models/Guide';
import { normalizeImages } from '@/lib/imageUtils';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    certificateNumber: '',
    location: '',
    country: '',
    instagram: '',
    facebook: '',
    services: '',
    placesVisited: [] as string[],
  });
  const [images, setImages] = useState<IImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [userType, setUserType] = useState<'guide' | 'explorer'>('guide');
  const [editingCaption, setEditingCaption] = useState<number | null>(null);
  const [tempCaption, setTempCaption] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchGuideData();
    }
  }, [status, router]);

  const fetchGuideData = async () => {
    try {
      const response = await fetch('/api/guides/me');
      const data = await response.json();
      
      if (response.ok) {
        setFormData({
          name: data.guide.name || '',
          email: data.guide.email || '',
          phone: data.guide.phone || '',
          whatsapp: data.guide.whatsapp || '',
          certificateNumber: data.guide.certificateNumber || '',
          location: data.guide.location || '',
          country: data.guide.country || '',
          instagram: data.guide.instagram || '',
          facebook: data.guide.facebook || '',
          services: data.guide.services || '',
          placesVisited: data.guide.placesVisited || [],
        });
        setImages(normalizeImages(data.guide.images));
        setUserType(data.guide.userType || 'guide');
      }
    } catch (error) {
      console.error('Error fetching guide data:', error);
      setError('Error al cargar tus datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/guides/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          placesVisited: formData.placesVisited.filter(place => place.trim() !== ''),
        }),
      });

      if (response.ok) {
        setMessage('Perfil actualizado exitosamente');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Error al actualizar');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPlace = () => {
    setFormData({
      ...formData,
      placesVisited: [...formData.placesVisited, ''],
    });
  };

  const handlePlaceChange = (index: number, value: string) => {
    const updatedPlaces = [...formData.placesVisited];
    updatedPlaces[index] = value;
    setFormData({
      ...formData,
      placesVisited: updatedPlaces,
    });
  };

  const handleRemovePlace = (index: number) => {
    const updatedPlaces = formData.placesVisited.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      placesVisited: updatedPlaces,
    });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/guides/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setImages(normalizeImages(data.images));
        setMessage('Imagen subida exitosamente');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Error al subir imagen');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!confirm('¿Está seguro de eliminar esta imagen?')) return;

    try {
      const response = await fetch(`/api/guides/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (response.ok) {
        setImages(normalizeImages(data.images));
        setMessage('Imagen eliminada exitosamente');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Error al eliminar imagen');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al eliminar imagen');
    }
  };

  const handleEditCaption = (index: number) => {
    setEditingCaption(index);
    setTempCaption(images[index].caption || '');
  };

  const handleSaveCaption = async (index: number) => {
    try {
      const updatedImages = [...images];
      updatedImages[index].caption = tempCaption;
      
      const response = await fetch('/api/guides/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: updatedImages,
        }),
      });

      if (response.ok) {
        setImages(updatedImages);
        setEditingCaption(null);
        setMessage('Descripción actualizada');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Error al actualizar descripción');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al actualizar descripción');
    }
  };

  const handleCancelEdit = () => {
    setEditingCaption(null);
    setTempCaption('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
                Explore.pe
              </a>
              <span className="text-gray-400">|</span>
              <h1 className="text-lg text-gray-700">
                Mi Perfil de {userType === 'guide' ? 'Guía' : 'Turista'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session?.user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    El email no se puede cambiar
                  </p>
                </div>

                {userType === 'guide' && (
                  <>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-1" />
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                        <MessageCircle className="inline w-4 h-4 mr-1" />
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Nro Certificado
                      </label>
                      <input
                        type="text"
                        id="certificateNumber"
                        name="certificateNumber"
                        value={formData.certificateNumber || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Certificado de guía turístico"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Número de certificado otorgado por MINCETUR
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Location and Services/Experience */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {userType === 'guide' ? 'Ubicación y Servicios' : 'Mi Experiencia'}
              </h3>
              <div className="space-y-6">
                {userType === 'guide' ? (
                  <>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        Dirección completa
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Nota: Cambiar la dirección no actualizará tu ubicación en el mapa automáticamente
                      </p>
                    </div>

                    <div>
                      <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="inline w-4 h-4 mr-1" />
                        Servicios de Guía
                      </label>
                      <textarea
                        id="services"
                        name="services"
                        value={formData.services}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe los servicios que ofreces..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        Mi ubicación actual
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ciudad o región donde estás"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        País de origen
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Estados Unidos, Brasil, Argentina"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        Lugares visitados en Perú
                      </label>
                      <div className="space-y-2">
                        {formData.placesVisited.map((place, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={place}
                              onChange={(e) => handlePlaceChange(index, e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Ej: Machu Picchu, Cusco, Arequipa"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePlace(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddPlace}
                          className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50"
                        >
                          <MapPin className="w-4 h-4" />
                          Agregar lugar visitado
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Ingresa los lugares que has visitado en Perú. Estos aparecerán en un mapa en tu perfil.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="inline w-4 h-4 mr-1" />
                        Mi experiencia en Perú
                      </label>
                      <textarea
                        id="services"
                        name="services"
                        value={formData.services}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Comparte tu experiencia viajando por Perú, lugares favoritos, recomendaciones..."
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Social Media - Only for guides */}
            {userType === 'guide' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Redes Sociales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                      <Instagram className="inline w-4 h-4 mr-1" />
                      Instagram
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="@tuusuario"
                    />
                  </div>

                  <div>
                    <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                      <Facebook className="inline w-4 h-4 mr-1" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://facebook.com/tupagina"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Images Gallery */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                <ImageIcon className="inline w-5 h-5 mr-2" />
                Galería de Imágenes
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Puedes subir hasta {userType === 'explorer' ? '50' : '20'} imágenes para mostrar {userType === 'explorer' ? 'tus aventuras' : 'tus servicios'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {images.map((image, index) => (
                  <div key={index} className="relative group bg-white rounded-lg shadow-sm overflow-hidden">
                    <img
                      src={image.url}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.url)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    {/* Caption section */}
                    <div className="p-3">
                      {editingCaption === index ? (
                        <div className="space-y-2">
                          <textarea
                            value={tempCaption}
                            onChange={(e) => setTempCaption(e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Describe esta imagen..."
                            rows={2}
                            maxLength={200}
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveCaption(index)}
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {image.caption || 'Sin descripción'}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleEditCaption(index)}
                            className="text-blue-500 hover:text-blue-600 flex-shrink-0"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {images.length < (userType === 'explorer' ? 50 : 20) && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Subiendo...' : 'Subir imagen'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              {images.length === (userType === 'explorer' ? 50 : 20) && (
                <p className="text-sm text-amber-600">
                  Has alcanzado el límite máximo de {userType === 'explorer' ? '50' : '20'} imágenes
                </p>
              )}
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> Para cambiar tu video de YouTube o eliminar tu perfil, 
              por favor contacta al administrador en admin@explore.pe
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}