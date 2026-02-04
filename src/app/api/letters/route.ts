import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const recipientName = formData.get('recipientName') as string;
    const message = formData.get('message') as string;
    const senderName = formData.get('senderName') as string | null;
    const photos = formData.getAll('photos') as File[];
    const voiceNote = formData.get('voiceNote') as File | null;

    if (!recipientName || !message) {
      return NextResponse.json(
        { error: 'Recipient name and message are required' },
        { status: 400 }
      );
    }

    // Use short slug for database compatibility (varchar 12 limit)
    const slug = generateSlug();

    // Insert letter
    console.log('[API] Creating letter in database...');
    const { data: letter, error: letterError } = await supabase
      .from('letters')
      .insert({
        slug,
        recipient_name: recipientName,
        message,
        sender_name: senderName || null,
      })
      .select()
      .single();

    if (letterError) {
      console.error('[API] Error creating letter:', letterError);
      return NextResponse.json(
        { error: 'Failed to create letter' },
        { status: 500 }
      );
    }
    console.log(`[API] Letter created with ID: ${letter.id}`);

    // Upload photos and voice note (sequential, simple)
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      
      if (!photo || photo.size === 0 || photo.size > 5 * 1024 * 1024) {
        continue;
      }

      const fileExt = photo.name.split('.').pop() || 'jpg';
      const fileName = `${letter.id}/${Date.now()}_${i}.${fileExt}`;
      const arrayBuffer = await photo.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('letter-attachments')
        .upload(fileName, buffer, {
          contentType: photo.type || 'image/jpeg',
          upsert: true,
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('letter-attachments')
          .getPublicUrl(fileName);

        await supabase.from('letter_attachments').insert({
          letter_id: letter.id,
          file_url: urlData.publicUrl,
          file_type: photo.type || 'image/jpeg',
          display_order: i,
        });
      }
    }

    // Upload voice note
    if (voiceNote && voiceNote.size > 0 && voiceNote.size <= 10 * 1024 * 1024) {
      const mimeType = voiceNote.type || 'audio/webm';
      let fileExt = 'webm';
      if (mimeType.includes('mp4') || mimeType.includes('m4a')) fileExt = 'mp4';
      else if (mimeType.includes('ogg')) fileExt = 'ogg';
      else if (mimeType.includes('wav')) fileExt = 'wav';
      
      const fileName = `${letter.id}/voice-note.${fileExt}`;
      const arrayBuffer = await voiceNote.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('letter-attachments')
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('letter-attachments')
          .getPublicUrl(fileName);

        await supabase.from('letter_attachments').insert({
          letter_id: letter.id,
          file_url: urlData.publicUrl,
          file_type: mimeType,
          display_order: 999,
        });
      }
    }

    return NextResponse.json({ slug, id: letter.id });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
