import { customAlphabet } from 'nanoid';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 4);

// Love-themed prefixes for special URLs
const lovePrefixes = ['luv', 'xo', '4u', 'hey', 'hi'];

export function generateSlug(): string {
  const prefix = lovePrefixes[Math.floor(Math.random() * lovePrefixes.length)];
  const code = nanoid();
  return `${prefix}-${code}`; // e.g., "luv-a3b2", "xo-k9m1", "4u-x2y3"
}

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://nakupenda.co.tz';
}

export function getLetterUrl(slug: string): string {
  return `${getBaseUrl()}/${slug}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      textArea.remove();
      return success;
    }
  } catch {
    return false;
  }
}
