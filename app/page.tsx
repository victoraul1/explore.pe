'use client';

import { useState, useEffect } from 'react';
import GoogleMap from '@/components/maps/GoogleMap';
import GuideCardCompact from '@/components/guides/GuideCardCompact';
import SearchBar from '@/components/ui/SearchBar';
import { IGuide } from '@/models/Guide';
import { Menu, X, Map, List } from 'lucide-react';

export default function Home() {
  const [guides, setGuides] = useState<IGuide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<IGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<IGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const [showTourists, setShowTourists] = useState(true);
  const [showCertifiedOnly, setShowCertifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    applyFilters(searchQuery, showGuides, showTourists, showCertifiedOnly);
  }, [guides]);

  const fetchGuides = async () => {
    try {
      const response = await fetch('/api/guides');
      const data = await response.json();
      setGuides(data.guides || []);
      setFilteredGuides(data.guides || []);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, showGuides, showTourists, showCertifiedOnly);
  };

  const applyFilters = (query: string, showGuidesFilter: boolean, showTouristsFilter: boolean, showCertifiedFilter: boolean) => {
    let filtered = [...guides];

    // Filter by user type
    filtered = filtered.filter(guide => {
      if (guide.userType === 'guide' && !showGuidesFilter) return false;
      if (guide.userType === 'explorer' && !showTouristsFilter) return false;
      return true;
    });

    // Filter by certification status (only applies to guides)
    if (showCertifiedFilter) {
      filtered = filtered.filter(guide => {
        // Only filter guides, not tourists/explorers
        if (guide.userType === 'guide') {
          return guide.certificateNumber && guide.certificateNumber.trim() !== '';
        }
        // Explorers/tourists pass through this filter
        return true;
      });
    }

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(guide => 
        guide.name.toLowerCase().includes(query.toLowerCase()) ||
        guide.location.toLowerCase().includes(query.toLowerCase()) ||
        guide.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredGuides(filtered);
  };

  const handleToggleGuides = () => {
    const newShowGuides = !showGuides;
    setShowGuides(newShowGuides);
    applyFilters(searchQuery, newShowGuides, showTourists, showCertifiedOnly);
  };

  const handleToggleTourists = () => {
    const newShowTourists = !showTourists;
    setShowTourists(newShowTourists);
    applyFilters(searchQuery, showGuides, newShowTourists, showCertifiedOnly);
  };

  const handleToggleCertified = () => {
    const newShowCertifiedOnly = !showCertifiedOnly;
    setShowCertifiedOnly(newShowCertifiedOnly);
    applyFilters(searchQuery, showGuides, showTourists, newShowCertifiedOnly);
  };

  const handleGuideSelect = (guide: IGuide) => {
    setSelectedGuide(guide);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Explore.pe</h1>
              <span className="ml-2 text-sm text-gray-600">Guías Turísticos del Perú</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <a
                href="/login"
                className="text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Iniciar Sesión
              </a>
              <a
                href="/register"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Registrar
              </a>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-2">
              <a
                href="/login"
                className="w-full text-center text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors block"
              >
                Iniciar Sesión
              </a>
              <a
                href="/register"
                className="w-full text-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors block"
              >
                Registrar
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Search Bar and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Bar - narrower on desktop */}
            <div className="w-full lg:w-1/2">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            {/* Filter Checkboxes */}
            <div className="flex flex-wrap gap-4 lg:gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGuides}
                  onChange={handleToggleGuides}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Mostrar Guías Turísticos
                </span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTourists}
                  onChange={handleToggleTourists}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Mostrar Turistas
                </span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCertifiedOnly}
                  onChange={handleToggleCertified}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Solo Guías con Nro de Certificado
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando guías...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="lg:hidden h-full">
              {mobileView === 'list' ? (
                /* Mobile List View - No Map */
                <div className="h-full bg-gray-50 overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    <div className="bg-white m-2 rounded-lg shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                        {filteredGuides.map((guide) => (
                          <GuideCardCompact
                            key={guide._id}
                            guide={guide}
                            onSelect={handleGuideSelect}
                            isSelected={selectedGuide?._id === guide._id}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Full Screen Mobile Map View */
                <div className="h-full relative">
                  <GoogleMap 
                    guides={filteredGuides}
                    onMarkerClick={handleGuideSelect}
                    selectedGuide={selectedGuide}
                  />
                  
                  {/* Mobile Map Bottom Sheet - Shows selected guide */}
                  {selectedGuide && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out" style={{ maxHeight: '60vh' }}>
                      <div className="relative h-full flex flex-col">
                        {/* Header with drag handle and close button */}
                        <div className="flex-shrink-0 p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>
                            <button
                              onClick={() => setSelectedGuide(null)}
                              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <X className="w-5 h-5 text-gray-500" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto px-4 pb-20"> {/* Extra padding bottom for toggle button */}
                          <GuideCardCompact
                            guide={selectedGuide}
                            onSelect={handleGuideSelect}
                            isSelected={true}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Mobile Toggle Button */}
              <button
                onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
                className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-800 transition-colors z-10"
              >
                {mobileView === 'list' ? (
                  <>
                    <Map className="w-4 h-4" />
                    <span>Ver mapa</span>
                  </>
                ) : (
                  <>
                    <List className="w-4 h-4" />
                    <span>Ver listado</span>
                  </>
                )}
              </button>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:flex h-full">
              {/* Left side - Guide List */}
              <div className="w-1/2 h-full overflow-y-auto border-r border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                  {filteredGuides.map((guide) => (
                    <GuideCardCompact
                      key={guide._id}
                      guide={guide}
                      onSelect={handleGuideSelect}
                      isSelected={selectedGuide?._id === guide._id}
                    />
                  ))}
                </div>
              </div>
              
              {/* Right side - Map */}
              <div className="w-1/2 h-full sticky top-0">
                <GoogleMap 
                  guides={filteredGuides}
                  onMarkerClick={handleGuideSelect}
                  selectedGuide={selectedGuide}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Results count - hidden on mobile when in map view */}
      <div className={`bg-white border-t px-4 py-2 ${mobileView === 'map' ? 'hidden lg:block' : ''}`}>
        <div className="max-w-7xl mx-auto text-sm text-gray-600">
          {filteredGuides.length} {filteredGuides.length === 1 ? 'resultado' : 'resultados'} encontrado{filteredGuides.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">
              Desarrollado por VRG Market Solutions | Todos los derechos reservados © 2025
            </p>
            <div className="flex gap-6">
              <a href="/terms" className="text-gray-300 hover:text-white text-sm">
                Términos de Servicio
              </a>
              <a href="/privacy" className="text-gray-300 hover:text-white text-sm">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}