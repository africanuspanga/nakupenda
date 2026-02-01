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
      console.error('Error creating letter:', letterError);
      return NextResponse.json(
        { error: 'Failed to create letter' },
        { status: 500 }
      );
    }

    // Upload photos if any
    if (photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        
        // Skip if not a valid file
        if (!photo || photo.size === 0) {
          // Skip invalid photo
          continue;
        }

        const fileExt = photo.name.split('.').pop() || 'jpg';
        const fileName = `${letter.id}/${Date.now()}_${i}.${fileExt}`;

        // Convert File to ArrayBuffer for upload
        const arrayBuffer = await photo.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { error: uploadError } = await supabase.storage
          .from('letter-attachments')
          .upload(fileName, buffer, {
            contentType: photo.type || 'image/jpeg',
            upsert: true,
          });

        if (uploadError) {
          console.error('Error uploading photo:', uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('letter-attachments')
          .getPublicUrl(fileName);

        const { error: attachmentError } = await supabase.from('letter_attachments').insert({
          letter_id: letter.id,
          file_url: urlData.publicUrl,
          file_type: photo.type || 'image/jpeg',
          display_order: i,
        });

        if (attachmentError) {
          console.error('Error saving attachment record:', attachmentError);
        }
      }
    }

    // Upload voice note if any
    let voiceNoteUrl = null;
    if (voiceNote && voiceNote.size > 0) {
      const fileName = `${letter.id}/voice-note.webm`;
      const arrayBuffer = await voiceNote.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('letter-attachments')
        .upload(fileName, buffer, {
          contentType: 'audio/webm',
          upsert: true,
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('letter-attachments')
          .getPublicUrl(fileName);
        voiceNoteUrl = urlData.publicUrl;

        // Save voice note as attachment with special type
        await supabase.from('letter_attachments').insert({
          letter_id: letter.id,
          file_url: voiceNoteUrl,
          file_type: 'audio/webm',
          display_order: 999, // Voice note always last
        });
      } else {
        console.error('Error uploading voice note:', uploadError);
      }
    }

    return NextResponse.json({ slug, id: letter.id });
  } catch (error) {
    console.error('Error in POST /api/letters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
