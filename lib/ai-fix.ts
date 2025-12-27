// AI-powered listing fix using Claude API

interface FixListingParams {
  title: string;
  description: string;
  violations: Array<{
    type: string;
    title: string;
    description: string;
  }>;
}

export async function generateListingFix({
  title,
  description,
  violations,
}: FixListingParams) {
  // Check if API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      success: false,
      error: 'AI fixes not configured. Add ANTHROPIC_API_KEY to your environment variables.',
    };
  }

  try {
    const violationsList = violations
      .map(v => `- ${v.title}: ${v.description}`)
      .join('\n');

    const prompt = `You are an expert at creating compliant TikTok Shop listings. 

I have a product listing that has violations. Please rewrite both the title and description to make them 100% compliant while keeping the product information accurate.

ORIGINAL TITLE:
${title}

ORIGINAL DESCRIPTION:
${description}

VIOLATIONS TO FIX:
${violationsList}

RULES:
1. Remove ALL forbidden keywords (miracle, guaranteed, cure, FDA approved, etc.)
2. Make NO medical claims
3. Make NO guarantees about results
4. Keep the listing informative and accurate
5. Maintain a professional tone
6. Keep title under 100 characters
7. Make description detailed but compliant

Please provide:
1. A new compliant title
2. A new compliant description

Format your response as JSON:
{
  "title": "new title here",
  "description": "new description here",
  "changes": ["list of key changes made"]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const result = JSON.parse(jsonMatch[0]);

    return {
      success: true,
      original: { title, description },
      fixed: {
        title: result.title,
        description: result.description,
      },
      changes: result.changes,
    };
  } catch (error) {
    console.error('AI fix error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate fix',
    };
  }
}

// Simple rule-based fixes (fallback if AI not available)
export function generateSimpleFix({
  title,
  description,
  violations,
}: FixListingParams) {
  let fixedTitle = title;
  let fixedDescription = description;
  const changes: string[] = [];

  // Common forbidden words to remove/replace
  const forbiddenWords: Record<string, string> = {
    miracle: 'effective',
    guaranteed: 'designed to',
    cure: 'help with',
    'FDA approved': 'quality',
    instant: 'quick',
    '100%': 'highly',
    'risk-free': 'quality',
    treatment: 'support',
    'clinically proven': 'tested',
    doctor: 'professional',
  };

  // Replace forbidden words
  Object.entries(forbiddenWords).forEach(([bad, good]) => {
    const regex = new RegExp(bad, 'gi');
    if (regex.test(fixedTitle)) {
      fixedTitle = fixedTitle.replace(regex, good);
      changes.push(`Replaced "${bad}" with "${good}" in title`);
    }
    if (regex.test(fixedDescription)) {
      fixedDescription = fixedDescription.replace(regex, good);
      changes.push(`Replaced "${bad}" with "${good}" in description`);
    }
  });

  // Remove excessive capitalization
  if (fixedTitle === fixedTitle.toUpperCase() && fixedTitle.length > 10) {
    fixedTitle = fixedTitle.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    changes.push('Fixed excessive capitalization in title');
  }

  // Remove excessive punctuation
  fixedTitle = fixedTitle.replace(/!{2,}/g, '!').replace(/\?{2,}/g, '?');
  fixedDescription = fixedDescription.replace(/!{2,}/g, '!').replace(/\?{2,}/g, '?');

  if (changes.length > 0) {
    changes.push('Cleaned up punctuation');
  }

  return {
    success: true,
    original: { title, description },
    fixed: {
      title: fixedTitle,
      description: fixedDescription,
    },
    changes: changes.length > 0 ? changes : ['Applied standard compliance improvements'],
    isSimpleFix: true,
  };
}
