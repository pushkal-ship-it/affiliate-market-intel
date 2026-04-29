// ============================================================
//  AFFILIATE INTEL — CENTRAL CONFIGURATION
//  Edit this file to customise the tool without touching code
// ============================================================


// ------------------------------------------------------------
//  ACCESS
// ------------------------------------------------------------

export const PASSWORD = 'Mediainvest12345';


// ------------------------------------------------------------
//  ANTHROPIC MODEL
//  Available: claude-sonnet-4-20250514 | claude-opus-4-20250514
// ------------------------------------------------------------

export const MODEL = 'claude-sonnet-4-5';
export const MAX_TOKENS = 1200;


// ------------------------------------------------------------
//  VERTICALS
//  Add or remove items from this list.
//  These appear as chips on the dashboard.
// ------------------------------------------------------------

export const DEFAULT_VERTICALS = [
  'Web Hosting',
  'Antivirus',
  'LLC Formation',
  'Student Loan Refinance',
];


// ------------------------------------------------------------
//  FOCUS MODES
//  Each focus mode changes the angle of the briefing.
//  - value:        internal key (do not change once set)
//  - label:        shown in the dropdown
//  - instruction:  sent to the AI — edit freely to sharpen output
// ------------------------------------------------------------

export const FOCUS_OPTIONS = [
  {
    value: 'general',
    label: 'General market overview',
    instruction: `Give a concise market overview: key trends, major player moves, and anything that would affect an affiliate marketer's strategy in the next 30-60 days. Highlight momentum shifts and emerging opportunities.`
  },
  {
    value: 'pricing',
    label: 'Pricing & deals changes',
    instruction: `Focus specifically on pricing changes, promotional deals, new plans, or pricing strategy shifts from major players. What should an affiliate know about current offers to maximise conversions? Include any limited-time deals or coupon activity.`
  },
  {
    value: 'competitors',
    label: 'Competitor moves & launches',
    instruction: `Highlight new product launches, rebrands, mergers, acquisitions, or competitive moves. Which companies are gaining or losing ground and why? What does this mean for affiliate positioning?`
  },
  {
    value: 'seo',
    label: 'SEO & affiliate trends',
    instruction: `Focus on SEO landscape changes, Google algorithm updates affecting this niche, affiliate program changes, commission structure updates, or content strategy shifts that matter for affiliate marketers. Are there new keywords, content formats, or ranking patterns emerging?`
  },
  {
    value: 'regulation',
    label: 'Regulation & legal news',
    instruction: `Highlight any regulatory news, data privacy updates, security incidents, FTC or advertising compliance changes, or legal developments that could affect this vertical or affiliate promotions. Flag anything that could create risk or opportunity.`
  },
];


// ------------------------------------------------------------
//  BRIEFING PROMPT TEMPLATE
//  Use {vertical}, {focusInstruction}, and {date} as placeholders.
//  This wraps all focus instructions above.
// ------------------------------------------------------------

export const BRIEFING_PROMPT = `You are a sharp market analyst briefing an affiliate marketing team. Search for the very latest news (last 2-4 weeks) about the "{vertical}" vertical.

{focusInstruction}

Structure your response exactly as follows:

**Top 3 Headlines**
For each: one sentence summary + one sentence on the affiliate implication.

**Market Signals**
3 short bullet points on sentiment, momentum, or notable data points.

**Affiliate Angle**
2-3 sentences on what this means for campaigns, content, or strategy right now. Be specific and actionable.

Rules: be data-driven where possible, skip generic filler, cite sources or brands by name. Today's date: {date}.`;


// ------------------------------------------------------------
//  BRANDING
//  Customise the name and description shown in the UI.
// ------------------------------------------------------------

export const BRAND = {
  name: 'Affiliate Market Intel',
  tagline: 'Real-time briefings for your active verticals',
  loginSubtitle: 'Enter your access password to continue',
};
