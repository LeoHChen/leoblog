/**
 * Content moderation utility to filter inappropriate comments
 */

// Common inappropriate words and phrases (partial list - extend as needed)
const BLOCKED_WORDS = [
  // Add words to block - keeping list minimal in code
  // This is just a basic example list
  'spam',
  'viagra',
  'casino',
  'porn',
  'xxx',
  // Add more as needed
];

// Patterns to detect (regex)
const BLOCKED_PATTERNS = [
  /\b(f+u+c+k+|s+h+i+t+|d+a+m+n+|b+i+t+c+h+|a+s+s+h+o+l+e+)\b/gi,
  /\b(p+o+r+n+|x+x+x+|s+e+x+)\b/gi,
  /(https?:\/\/[^\s]+)/gi, // Block URLs (common in spam)
  /\b\d{10,}\b/g, // Block long number sequences (phone numbers)
];

export interface ModerationResult {
  isClean: boolean;
  reason?: string;
  confidence?: number;
}

/**
 * Basic client-side content moderation
 */
export function moderateContent(text: string): ModerationResult {
  if (!text || text.trim().length === 0) {
    return { isClean: false, reason: 'Empty content' };
  }

  const lowerText = text.toLowerCase();

  // Check for blocked words
  for (const word of BLOCKED_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      return {
        isClean: false,
        reason: 'Content contains inappropriate language',
        confidence: 0.9,
      };
    }
  }

  // Check for blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isClean: false,
        reason: 'Content contains inappropriate patterns or links',
        confidence: 0.8,
      };
    }
  }

  // Check for excessive caps (common in spam)
  const capsCount = (text.match(/[A-Z]/g) || []).length;
  const totalLetters = (text.match(/[a-zA-Z]/g) || []).length;
  if (totalLetters > 10 && capsCount / totalLetters > 0.7) {
    return {
      isClean: false,
      reason: 'Excessive use of capital letters',
      confidence: 0.6,
    };
  }

  // Check for excessive repetition (spam indicator)
  const words = text.split(/\s+/);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  if (words.length > 5 && uniqueWords.size / words.length < 0.3) {
    return {
      isClean: false,
      reason: 'Excessive word repetition detected',
      confidence: 0.7,
    };
  }

  return { isClean: true };
}

/**
 * Advanced moderation using OpenAI Moderation API (optional)
 * Only call this if OPENAI_API_KEY is configured
 */
export async function moderateContentWithAI(
  text: string,
  apiKey: string
): Promise<ModerationResult> {
  try {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ input: text }),
    });

    if (!response.ok) {
      throw new Error('Moderation API request failed');
    }

    const data = await response.json();
    const result = data.results[0];

    if (result.flagged) {
      // Find the highest scoring category
      const categories = Object.entries(result.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category]) => category);

      return {
        isClean: false,
        reason: `Content flagged for: ${categories.join(', ')}`,
        confidence: Math.max(...Object.values(result.category_scores as Record<string, number>)),
      };
    }

    return { isClean: true };
  } catch (error) {
    console.error('AI moderation failed:', error);
    // Fall back to basic moderation
    return moderateContent(text);
  }
}

/**
 * Sanitize text to prevent XSS attacks
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
