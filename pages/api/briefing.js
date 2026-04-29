import { MODEL, MAX_TOKENS, FOCUS_OPTIONS, BRIEFING_PROMPT } from '../../config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { vertical, focus } = req.body;

  if (!vertical || !focus) {
    return res.status(400).json({ error: 'Missing vertical or focus' });
  }

  const focusOption = FOCUS_OPTIONS.find(f => f.value === focus);
  if (!focusOption) {
    return res.status(400).json({ error: 'Invalid focus value' });
  }

  const prompt = BRIEFING_PROMPT
    .replace('{vertical}', vertical)
    .replace('{focusInstruction}', focusOption.instruction)
    .replace('{date}', new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    }));

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({ error: err.error?.message || 'Anthropic API error' });
    }

    const data = await response.json();
    const text = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch briefing: ' + err.message });
  }
}
