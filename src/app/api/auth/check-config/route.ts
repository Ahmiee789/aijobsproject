import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  // Prevent build-time crash: skip logic if keys are not set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.warn('Supabase config missing during build or runtime.');
    return NextResponse.json(
      { error: 'Supabase config not available' },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey);

    // your upload logic here (example)
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(`uploads/${file.name}`, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
