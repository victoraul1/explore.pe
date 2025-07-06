'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Upload, Facebook, Instagram, MessageCircle, UserCircle2, Camera, Plus, X } from 'lucide-react';

export default function RegisterGuide() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'guide' | 'explorer'>('guide');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsapp: '',
    location: '',
    youtubeUrl: '',
    instagram: '',
    facebook: '',
    services: '',
  });
  const [explorerLocations, setExplorerLocations] = useState<string[]>(['']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords
      if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }

      // Extract video ID from YouTube URL
      const youtubeMatch = formData.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      const youtubeId = youtubeMatch ? youtubeMatch[1] : '';
      
      if (!youtubeId) {
        alert('Por favor, ingrese una URL válida de YouTube');
        setLoading(false);
        return;
      }

      const youtubeEmbed = `https://www.youtube.com/embed/${youtubeId}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          youtubeEmbed,
          userType,
          category: userType === 'explorer' ? 'Explorer' : 'Guía turística',
          locations: userType === 'explorer' ? explorerLocations.filter(loc => loc.trim()) : undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        alert(`¡Registro exitoso! Tu perfil de ${userType === 'guide' ? 'guía' : 'explorador'} ha sido creado. Revisa tu correo para verificar tu cuenta.`);
        router.push('/');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al registrar');
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.name === 'AbortError') {
        alert('La solicitud tardó demasiado. Por favor, intente nuevamente.');
      } else {
        alert('Error al registrar. Por favor, intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio
            </button>
            <h1 className="text-xl font-bold text-gray-900">Únete a Explore.pe</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Cómo quieres unirte a Explore.pe?
            </h2>
            
            {/* User Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setUserType('guide')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  userType === 'guide' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <UserCircle2 className="w-12 h-12 mb-3 mx-auto text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">Soy Guía Turístico</h3>
                <p className="text-sm text-gray-600">
                  Ofrece tus servicios profesionales como guía y conecta con turistas
                </p>
              </button>
              
              <button
                type="button"
                onClick={() => setUserType('explorer')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  userType === 'explorer' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Camera className="w-12 h-12 mb-3 mx-auto text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">Soy Explorador</h3>
                <p className="text-sm text-gray-600">
                  Comparte tus experiencias y aventuras en Perú con otros viajeros
                </p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {userType === 'guide' ? 'Nombre completo' : 'Nombre de usuario'} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={userType === 'guide' ? 'Juan Pérez' : 'ExplorerPeru'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Repite tu contraseña"
                  />
                </div>

                {userType === 'guide' && (
                  <>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(+51) 999-999-999"
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
                        placeholder="(+51) 999-999-999"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Location and Service/Experience */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {userType === 'guide' ? 'Ubicación y Servicios' : 'Ubicación y Experiencias'}
              </h3>
              <div className="space-y-6">
                {userType === 'guide' ? (
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Dirección completa *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Av. Ejemplo 123, Distrito, Ciudad, Perú"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Ingresa tu dirección completa para que los turistas puedan ubicarte en el mapa
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Lugares visitados en Perú *
                    </label>
                    <div className="space-y-2">
                      {explorerLocations.map((location, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => {
                              const newLocations = [...explorerLocations];
                              newLocations[index] = e.target.value;
                              setExplorerLocations(newLocations);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: Cusco, Machu Picchu"
                            required={index === 0}
                          />
                          {explorerLocations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newLocations = explorerLocations.filter((_, i) => i !== index);
                                setExplorerLocations(newLocations);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      {explorerLocations.length < 10 && (
                        <button
                          type="button"
                          onClick={() => setExplorerLocations([...explorerLocations, ''])}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar otro lugar
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Agrega los lugares que visitaste en Perú (máximo 10)
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-2">
                    {userType === 'guide' ? 'Servicios de Guía' : 'Tu experiencia en Perú'} *
                  </label>
                  <textarea
                    id="services"
                    name="services"
                    value={formData.services}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      userType === 'guide'
                        ? 'Describe los servicios que ofreces: tours disponibles, idiomas que hablas, especialidades, duración de tours, etc.'
                        : 'Comparte tu experiencia: lugares visitados, actividades realizadas, consejos para otros viajeros, etc.'
                    }
                  />
                </div>
              </div>
            </div>

            {/* Online Presence */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Presencia en Línea</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="inline w-4 h-4 mr-1" />
                    URL de video de YouTube *
                  </label>
                  <input
                    type="url"
                    id="youtubeUrl"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {userType === 'guide'
                      ? 'Sube un video a YouTube presentándote como guía turístico'
                      : 'Comparte un video de tu aventura en Perú'
                    }
                  </p>
                </div>

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
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                {userType === 'explorer' && (
                  <>
                    <strong>Nota para Exploradores:</strong> Después de registrarte, podrás subir hasta 30 fotos de tus aventuras en Perú.
                  </>
                )}
                {userType === 'guide' && (
                  <>
                    <strong>Nota para Guías:</strong> Después de registrarte, podrás subir hasta 8 fotos de tus servicios y experiencias.
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6">
              <p className="text-sm text-gray-500">
                * Campos obligatorios
              </p>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrando...' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}