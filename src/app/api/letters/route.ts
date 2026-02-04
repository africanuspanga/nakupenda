import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('[API] Starting letter creation request');
  
  try {
    const formData = await request.formData();
    const recipientName = formData.get('recipientName') as string;
    const message = formData.get('message') as string;
    const senderName = formData.get('senderName') as string | null;
    const photos = formData.getAll('photos') as File[];
    const voiceNote = formData.get('voiceNote') as File | null;

    console.log(`[API] Received: ${photos.length} photos, voiceNote: ${voiceNote ? 'yes' : 'no'}`);

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

    // Upload photos if any
    if (photos.length > 0) {
      console.log(`[API] Starting upload of ${photos.length} photos`);
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
        if (!photo || photo.size === 0 || photo.size > MAX_FILE_SIZE) {
          console.error(`[API] Photo ${i} invalid or too large: ${photo?.size || 0} bytes`);
          continue;
        }

        const fileExt = photo.name.split('.').pop() || 'jpg';
        const fileName = `${letter.id}/${Date.now()}_${i}.${fileExt}`;

        console.log(`[API] Uploading photo ${i}: ${fileName}`);

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
          console.error(`[API] Error uploading photo ${i}:`, uploadError);
          continue;
        }
        console.log(`[API] Photo ${i} uploaded successfully`);

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
          console.error(`[API] Error saving attachment record ${i}:`, attachmentError);
        } else {
          console.log(`[API] Photo ${i} attachment record saved`);
        }
      }
    }

    // Upload voice note if any
    let voiceNoteUrl = null;
    if (voiceNote && voiceNote.size > 0) {
      console.log(`[API] Starting voice note upload: ${voiceNote.size} bytes`);
      
      // Check voice note size (10MB limit)
      const MAX_VOICE_SIZE = 10 * 1024 * 1024;
      if (voiceNote.size > MAX_VOICE_SIZE) {
        console.error(`[API] Voice note too large: ${voiceNote.size} bytes`);
      } else {
        // Determine file extension based on MIME type
        const mimeType = voiceNote.type || 'audio/webm';
      let fileExt = 'webm';
      if (mimeType.includes('mp4') || mimeType.includes('m4a')) {
        fileExt = 'mp4';
      } else if (mimeType.includes('ogg')) {
        fileExt = 'ogg';
      } else if (mimeType.includes('wav')) {
        fileExt = 'wav';
      }
      
      const fileName = `${letter.id}/voice-note.${fileExt}`;
      const arrayBuffer = await voiceNote.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('letter-attachments')
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadError) {
        console.error('[API] Error uploading voice note:', uploadError);
      } else {
        console.log('[API] Voice note uploaded successfully');
        
        const { data: urlData } = supabase.storage
          .from('letter-attachments')
          .getPublicUrl(fileName);
        voiceNoteUrl = urlData.publicUrl;

        // Save voice note as attachment with audio type
        const { error: voiceAttachmentError } = await supabase.from('letter_attachments').insert({
          letter_id: letter.id,
          file_url: voiceNoteUrl,
          file_type: mimeType,
          display_order: 999, // Voice note always last
        });
        
        if (voiceAttachmentError) {
          console.error('[API] Error saving voice note attachment:', voiceAttachmentError);
        } else {
          console.log('[API] Voice note attachment record saved');
        }
      }
    }
    }

    const duration = Date.now() - startTime;
    console.log(`[API] Letter created successfully in ${duration}ms: ${slug}`);

    return NextResponse.json({ slug, id: letter.id });
  } catch (error) {
    console.error('[API] Error in POST /api/letters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
