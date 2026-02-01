import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Letter = {
  id: string;
  slug: string;
  recipient_name: string;
  message: string;
  sender_name: string | null;
  created_at: string;
  opened_at: string | null;
  open_count: number;
};

export type LetterAttachment = {
  id: string;
  letter_id: string;
  file_url: string;
  file_type: string | null;
  display_order: number;
  created_at: string;
};
