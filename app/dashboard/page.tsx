'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Instagram, 
  Facebook, 
  MessageCircle,
  FileText,
  LogOut,
  Save,
  AlertCircle,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';

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
    location: '',
    instagram: '',
    facebook: '',
    services: '',
    price: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

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
          location: data.guide.location || '',
          instagram: data.guide.instagram || '',
          facebook: data.guide.facebook || '',
          services: data.guide.services || '',
          price: data.guide.price?.toString() || '',
        });
        setImages(data.guide.images || []);
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
          price: formData.price ? parseFloat(formData.price) : undefined,
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
        setImages(data.images);
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
        setImages(data.images);
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
            <h1 className="text-xl font-bold text-gray-900">Mi Perfil de Guía</h1>
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
              </div>
            </div>

            {/* Location and Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ubicación y Servicios</h3>
              <div className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="inline w-4 h-4 mr-1" />
                      Precio por hora (S/)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
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

            {/* Images Gallery */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                <ImageIcon className="inline w-5 h-5 mr-2" />
                Galería de Imágenes
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Puedes subir hasta 8 imágenes para mostrar tus servicios
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {images.length < 8 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
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
              
              {images.length === 8 && (
                <p className="text-sm text-amber-600">
                  Has alcanzado el límite máximo de 8 imágenes
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