import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';
import { slugify } from '@/lib/slugify';

export async function POST() {
  try {
    await dbConnect();
    
    // Get all guides without slugs
    const guides = await Guide.find({ slug: { $exists: false } });
    
    const updates = [];
    
    for (const guide of guides) {
      let baseSlug = slugify(guide.name);
      let slug = baseSlug;
      let counter = 1;
      
      // Check if slug already exists and make it unique
      while (await Guide.findOne({ slug, _id: { $ne: guide._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      // For tourists, append country to slug if provided
      if (guide.userType === 'explorer' && guide.country) {
        const countrySlug = slugify(guide.country);
        slug = `${slug}-${countrySlug}`;
      }
      
      // Update the guide with the new slug
      await Guide.findByIdAndUpdate(guide._id, { slug });
      updates.push({ name: guide.name, slug });
    }
    
    return NextResponse.json({ 
      message: `Updated ${updates.length} guides with slugs`,
      updates 
    });
  } catch (error) {
    console.error('Error updating slugs:', error);
    return NextResponse.json(
      { error: 'Failed to update slugs' },
      { status: 500 }
    );
  }
}