import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

const dummyGuides = [
  {
    name: 'Victor Hernandez',
    category: 'Guía turística',
    location: 'Jr Santiago Cardenas 228 Balconcillo, La Victoria, Lima, Peru',
    phone: '(+51) 988-505-087',
    email: 'lima@gmail.com',
    youtubeEmbed: 'https://www.youtube.com/embed/AUyJjgHCW7I',
    lat: -12.0833,
    lng: -77.0333,
    price: 23,
    rating: { stars: 4.8, count: 55 }
  },
  {
    name: 'Juan Perez',
    category: 'Guía turística',
    location: 'Jr. Bolognesi 100, Tumbes, Perú',
    phone: '(+51) 988-505-087',
    email: 'tumbes@gmail.com',
    instagram: '@explore.pe',
    youtubeEmbed: 'https://www.youtube.com/embed/cd1_v8PahC0',
    lat: -3.5667,
    lng: -80.45,
    price: 24,
    rating: { stars: 4.6, count: 38 }
  },
  {
    name: 'Ana Gomez',
    category: 'Guía turística',
    location: 'Jr. Echenique 350 - Plaza Sargento Lores, Loreto, Peru',
    phone: '(+51) 988-505-087',
    email: 'iquitos@gmail.com',
    instagram: '@explore.pe',
    youtubeEmbed: 'https://www.youtube.com/embed/KZMj7JYM_io',
    lat: -3.7437,
    lng: -73.2516,
    price: 30,
    rating: { stars: 4.9, count: 71 }
  },
  {
    name: 'Maria Palacios',
    category: 'Guía turística',
    location: 'Galerías Turísticas S/N Av. El Sol - Cusco - Cusco - Cusco - Perú',
    phone: '(+51) 988-505-087',
    email: 'cusco@gmail.com',
    instagram: '@explore.pe',
    youtubeEmbed: 'https://www.youtube.com/embed/aF7yTUVCkX8',
    lat: -13.5163,
    lng: -71.9785,
    price: 25,
    rating: { stars: 4.5, count: 44 }
  },
  {
    name: 'Eduardo Garcia',
    category: 'Guía turística',
    location: 'Calle Álvarez Thomas 312, Cercado Arequipa, Peru',
    phone: '(+51) 988-505-087',
    email: 'arequipa@gmail.com',
    instagram: '@explore.pe',
    youtubeEmbed: 'https://www.youtube.com/embed/9JC0mw2J8FM',
    lat: -16.409,
    lng: -71.5375,
    price: 21,
    rating: { stars: 4.4, count: 31 }
  },
  {
    name: 'Carlos Hernandez',
    category: 'Guía turística',
    location: 'Jr Deustua Nro. 458 - Plaza de Armas Puno, Peru',
    phone: '(+51) 988-505-087',
    email: 'puno@gmail.com',
    instagram: '@explore.pe',
    youtubeEmbed: 'https://www.youtube.com/embed/ri3cNF5rJS8',
    lat: -15.8402,
    lng: -70.0219,
    price: 20,
    rating: { stars: 4.7, count: 62 }
  },
  {
    name: 'Manuel Infante',
    category: 'Guía turística',
    location: 'Av. Municipalidad Nº 182 - Ica, Peru',
    phone: '(+51) 988-505-087',
    email: 'ica@gmail.com',
    instagram: '@explore.pe',
    youtubeEmbed: 'https://www.youtube.com/embed/BqLL_veMatQ',
    lat: -14.0667,
    lng: -75.7333,
    price: 22,
    rating: { stars: 4.3, count: 27 }
  },
  {
    name: 'Paco Paredes',
    category: 'Guía turística',
    location: 'Plaza de Armas de Huaraz, Peru',
    phone: '(+51) 988-505-087',
    email: 'ancash@gmail.com',
    instagram: '@explore.pe',
    youtubeEmbed: 'https://www.youtube.com/embed/6VogADCtThE',
    lat: -9.5299,
    lng: -77.5289,
    price: 19,
    rating: { stars: 4.5, count: 48 }
  }
];

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing guides
    await Guide.deleteMany({});
    
    // Insert dummy guides
    const guides = await Guide.insertMany(dummyGuides);
    
    return NextResponse.json({ 
      message: 'Database seeded successfully', 
      count: guides.length 
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}