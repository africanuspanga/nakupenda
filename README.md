# Nakupenda 💌

**Create beautiful letters for your loved ones**

A romantic digital letter-writing platform that brings back the nostalgic experience of handwritten love letters in a modern, shareable format.

**Domain:** nakupenda.co.tz  
**Launch Target:** Valentine's Season 2026

## Features

- ✉️ Beautiful envelope opening animations
- 📝 Elegant letter composition with script fonts
- 📷 Photo attachments (up to 5 per letter)
- 🔗 Shareable unique links
- 📱 Mobile-first design
- 🎨 Premium romantic aesthetic

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Animations:** Framer Motion

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run this SQL in the SQL Editor:

```sql
-- Letters table
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(12) UNIQUE NOT NULL,
  recipient_name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  sender_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  opened_at TIMESTAMP,
  open_count INTEGER DEFAULT 0
);

-- Letter attachments (photos)
CREATE TABLE letter_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  letter_id UUID REFERENCES letters(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('letter-attachments', 'letter-attachments', true);

-- Allow public access to attachments
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'letter-attachments');

CREATE POLICY "Allow uploads" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'letter-attachments');
```

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_URL=https://nakupenda.co.tz
```

Find these values in Supabase: **Settings → API**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── create/
│   │   ├── page.tsx          # Letter composition
│   │   └── share/[slug]/     # Share page
│   ├── open/page.tsx         # Open letter by code
│   ├── [slug]/page.tsx       # View letter (recipient)
│   └── api/letters/          # API routes
├── components/
│   ├── Button.tsx
│   ├── Envelope.tsx
│   └── LetterPaper.tsx
└── lib/
    ├── supabase.ts
    └── utils.ts
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set environment variables in Vercel dashboard.

## License

MIT
