import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Guide from '@/models/Guide';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  
  await dbConnect();
  
  const guide = await Guide.findOne({ slug }).lean();
  
  return NextResponse.json({
    slug,
    found: !!guide,
    guide: guide || null,
    query: { slug, userType: 'guide', active: true }
  });
}