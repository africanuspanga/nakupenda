import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch letter
    const { data: letter, error: letterError } = await supabase
      .from('letters')
      .select('*')
      .eq('slug', slug)
      .single();

    if (letterError || !letter) {
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      );
    }

    // Fetch attachments
    const { data: attachments } = await supabase
      .from('letter_attachments')
      .select('*')
      .eq('letter_id', letter.id)
      .order('display_order', { ascending: true });

    // Update open count
    await supabase
      .from('letters')
      .update({
        open_count: (letter.open_count || 0) + 1,
        opened_at: letter.opened_at || new Date().toISOString(),
      })
      .eq('id', letter.id);

    return NextResponse.json({
      letter,
      attachments: attachments || [],
    });
  } catch (error) {
    console.error('Error in GET /api/letters/[slug]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
