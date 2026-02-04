# Vercel 10-Second Timeout Issue

## Problem
When uploading both photos AND voice notes together, the API fails with a 500 error.
This is because Vercel Hobby plan has a 10-second timeout for serverless functions.

## Why It Happens
1. Image compression happens in browser (good)
2. But upload to Supabase happens sequentially (slow):
   - Photo 1 upload: 2-4 seconds
   - Photo 2 upload: 2-4 seconds  
   - Voice note upload: 2-4 seconds
   - Total: 6-12 seconds (exceeds 10s limit)

## How to Check Vercel Logs

1. Go to https://vercel.com/dashboard
2. Click on your nakupenda project
3. Click "Deployments" tab
4. Click the latest deployment
5. Click "Functions" tab
6. Look for `/api/letters` function
7. Click "Logs" to see errors

## What to Look For
```
Task timed out after 10.01 seconds
```

## Solutions

### Option 1: Upgrade to Vercel Pro ($20/month)
- Increases timeout to 60 seconds
- Simplest solution

### Option 2: Process Uploads in Parallel (Code Change)
Instead of uploading one by one, upload all files simultaneously:
```javascript
// Current (slow - sequential)
for (const photo of photos) {
  await upload(photo) // waits for each
}

// Better (fast - parallel)
await Promise.all(photos.map(p => upload(p)))
```

### Option 3: Reduce File Sizes Further
- Reduce max photos from 2 to 1
- Reduce image quality from 80% to 60%
- Reduce max width from 1200px to 800px

### Option 4: Direct Upload (Architecture Change)
Upload directly from browser to Supabase, bypassing the API route entirely.

## Immediate Fix
I've optimized the code to process uploads in parallel. Check the latest commit.

If it still fails, the only guaranteed solution is upgrading to Vercel Pro.
