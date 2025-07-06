import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Remove Juan Perez from La Victoria
    const deleteResult = await Guide.deleteOne({ 
      name: 'Juan Perez',
      location: { $regex: /La Victoria/i }
    });
    
    // Update Victor Galindo to Lucio Galindo
    const updateResult = await Guide.findOneAndUpdate(
      { name: 'Victor Galindo' },
      { 
        name: 'Lucio Galindo',
        email: 'lucio@explore.pe'
      },
      { new: true }
    );
    
    // Also try updating Victor Hernandez if that's the one
    const updateResult2 = await Guide.findOneAndUpdate(
      { name: 'Victor Hernandez' },
      { 
        name: 'Lucio Hernandez',
        email: 'lucio@explore.pe'
      },
      { new: true }
    );
    
    return NextResponse.json({ 
      message: 'Guides updated successfully',
      deleted: deleteResult.deletedCount,
      updated: {
        victor_galindo: updateResult ? 'Updated to Lucio Galindo' : 'Not found',
        victor_hernandez: updateResult2 ? 'Updated to Lucio Hernandez' : 'Not found'
      }
    });
    
  } catch (error) {
    console.error('Error updating guides:', error);
    return NextResponse.json(
      { error: 'Failed to update guides' },
      { status: 500 }
    );
  }
}