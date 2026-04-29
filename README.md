# Affiliate Market Intelligence Tool

---

## File structure

  affiliate-intel/
  ├── config.js              ← EDIT THIS to customise everything
  ├── package.json
  ├── pages/
  │   ├── _app.js
  │   ├── index.js           ← UI
  │   └── api/
  │       └── briefing.js    ← secure API proxy
  └── styles/
      └── globals.css

---

## config.js — what you can change

  PASSWORD          The login password
  MODEL             Claude model to use
  MAX_TOKENS        Max briefing length
  DEFAULT_VERTICALS Vertical chips shown by default
  FOCUS_OPTIONS     Dropdown options + AI instructions per focus
  BRIEFING_PROMPT   Full prompt template sent to the AI
  BRAND             Tool name, tagline, login subtitle

---

## Deploy to Vercel

Option A — GitHub
  1. Push this folder to a new GitHub repo
  2. vercel.com → New Project → Import repo
  3. Add environment variable: ANTHROPIC_API_KEY = your key
  4. Deploy

Option B — Vercel CLI
  1. npm i -g vercel
  2. Run: vercel  (inside this folder)
  3. Add ANTHROPIC_API_KEY in Vercel dashboard → Settings → Env Vars
  4. Run: vercel --prod

---

## Get your Anthropic API key
  console.anthropic.com → API Keys → Create Key

---

## Common changes (all in config.js)

  Change password       Update PASSWORD value, redeploy
  Add/remove verticals  Edit DEFAULT_VERTICALS array, redeploy
  Edit AI instructions  Edit instruction field in FOCUS_OPTIONS, redeploy
  Rename the tool       Edit BRAND.name and BRAND.tagline, redeploy
