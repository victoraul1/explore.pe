'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  UserX,
  UserCheck,
  Trash2,
  Power,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Guide {
  _id: string;
  name: string;
  email: string;
  phone: string;
  certificateNumber?: string;
  location: string;
  active: boolean;
  emailVerified: boolean;
  role: string;
  userType?: 'guide' | 'explorer';
  createdAt: string;
  images?: string[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Check if user is admin
    checkAdminAndFetchGuides();
  }, [status, router]);

  const checkAdminAndFetchGuides = async () => {
    try {
      // First check if current user is admin
      const meResponse = await fetch('/api/guides/me');
      const meData = await meResponse.json();
      
      if (!meResponse.ok || meData.guide?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      // Fetch all guides
      const response = await fetch('/api/admin/guides');
      const data = await response.json();
      
      if (response.ok) {
        setGuides(data.guides);
        setFilteredGuides(data.guides);
      } else {
        setError('Error al cargar guías');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredGuides(guides);
      return;
    }

    const filtered = guides.filter(guide => 
      guide.name.toLowerCase().includes(term.toLowerCase()) ||
      guide.email.toLowerCase().includes(term.toLowerCase()) ||
      guide.location.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredGuides(filtered);
  };

  const handleToggleActive = async (guideId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/guides/${guideId}/toggle-active`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (response.ok) {
        setGuides(guides.map(g => 
          g._id === guideId ? { ...g, active: !currentStatus } : g
        ));
        setFilteredGuides(filteredGuides.map(g => 
          g._id === guideId ? { ...g, active: !currentStatus } : g
        ));
        setMessage(`Guía ${!currentStatus ? 'activada' : 'suspendida'} exitosamente`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al actualizar');
    }
  };

  const handleDelete = async (guideId: string) => {
    if (!confirm('¿Está seguro de eliminar esta cuenta permanentemente?')) return;

    try {
      const response = await fetch(`/api/admin/guides/${guideId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGuides(guides.filter(g => g._id !== guideId));
        setFilteredGuides(filteredGuides.filter(g => g._id !== guideId));
        setMessage('Guía eliminada exitosamente');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Error al eliminar guía');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="text-xl font-bold hover:text-gray-300">
                Explore.pe
              </a>
              <span className="text-gray-500">|</span>
              <h1 className="text-lg">Panel de Administración</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">{session?.user?.email}</span>
              <a
                href="/dashboard"
                className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
              >
                Mi Perfil
              </a>
              <a
                href="/"
                className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
              >
                Ver Sitio
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Gestión de Guías ({filteredGuides.length})
              </h2>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o ubicación..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verificado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imágenes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuides.map((guide) => (
                  <React.Fragment key={guide._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {guide.name}
                            {guide.role === 'admin' && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{guide.location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          guide.userType === 'explorer'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {guide.userType === 'explorer' ? 'Turista' : 'Guía'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{guide.email}</div>
                        <div className="text-sm text-gray-500">{guide.phone || 'N/A'}</div>
                        {guide.userType === 'guide' && guide.certificateNumber && (
                          <div className="text-xs text-blue-600">Cert: {guide.certificateNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          guide.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {guide.active ? 'Activo' : 'Suspendido'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {guide.emailVerified ? (
                          <UserCheck className="w-5 h-5 text-green-600" />
                        ) : (
                          <UserX className="w-5 h-5 text-red-600" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setExpandedGuide(expandedGuide === guide._id ? null : guide._id)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          {guide.images?.length || 0} fotos
                          {expandedGuide === guide._id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(guide._id, guide.active)}
                            className={`p-1 rounded ${
                              guide.active 
                                ? 'text-yellow-600 hover:bg-yellow-100' 
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={guide.active ? 'Suspender' : 'Activar'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          {guide.role !== 'admin' && (
                            <button
                              onClick={() => handleDelete(guide._id)}
                              className="p-1 rounded text-red-600 hover:bg-red-100"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedGuide === guide._id && guide.images && guide.images.length > 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-4 gap-2">
                            {guide.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`${guide.name} - Imagen ${index + 1}`}
                                className="w-full h-32 object-cover rounded"
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}