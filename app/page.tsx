'use client';

import { useState, useEffect } from 'react';
import GoogleMap from '@/components/maps/GoogleMap';
import GuideCardCompact from '@/components/guides/GuideCardCompact';
import SearchBar from '@/components/ui/SearchBar';
import { IGuide } from '@/models/Guide';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [guides, setGuides] = useState<IGuide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<IGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<IGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

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
    if (!query.trim()) {
      setFilteredGuides(guides);
      return;
    }

    const filtered = guides.filter(guide => 
      guide.name.toLowerCase().includes(query.toLowerCase()) ||
      guide.location.toLowerCase().includes(query.toLowerCase()) ||
      guide.email.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredGuides(filtered);
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
                Registrar Guía
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
                Registrar Guía
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando guías...</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex">
            {/* Left side - Guide List */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto lg:border-r border-gray-200">
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
            
            {/* Right side - Map (hidden on mobile) */}
            <div className="hidden lg:block lg:w-1/2 h-full sticky top-0">
              <GoogleMap 
                guides={filteredGuides}
                onMarkerClick={handleGuideSelect}
                selectedGuide={selectedGuide}
              />
            </div>
          </div>
        )}
      </main>

      {/* Results count */}
      <div className="bg-white border-t px-4 py-2">
        <div className="max-w-7xl mx-auto text-sm text-gray-600">
          {filteredGuides.length} guías encontrados
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>
            Developed by{' '}
            <a 
              href="https://www.vrgmarketsolutions.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              VRG Market Solutions
            </a>
            {' '}| All rights reserved © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}