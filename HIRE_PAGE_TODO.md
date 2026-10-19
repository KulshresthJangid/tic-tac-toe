# /hire page — follow-ups

All code placeholders in `src/pages/Hire.tsx` are now filled in (Calendly
link, Web3Forms key, overlap hours, offer timelines). Two things left that
live outside this repo, on the external dashboards themselves:

1. **Calendly event has no meeting location set yet** — add Zoom, Google
   Meet, or a phone number in the event's settings on calendly.com, or
   clients booking a call won't know how to join.
2. **Web3Forms' "Website URL" is set to `localhost`** (a placeholder used
   during setup) — once this site is live at the real domain, update it to
   `https://buildwithkulshresth.com` in the Web3Forms dashboard.

Offer-card timelines (`2-4 weeks` / `2-4 weeks` / `1-2 weeks`) were my own
reasonable defaults, not something you confirmed — correct them in
`src/pages/Hire.tsx` (search `timeline:`) if they're off.

## Known, pre-existing — not introduced by this page
- `og-image.png` is referenced site-wide (including `/hire`) but doesn't
  exist in `public/` or `dist/` — every page's OG preview is currently broken.
- Lighthouse on `/hire`: Performance 89-90, Accessibility 94, Best Practices
  100, SEO 100. The homepage scores 92/96 on the same two under identical
  local conditions — driven by the whole site being one unsplit SPA bundle
  and the nav's `text-white/40` inactive-link contrast (fails WCAG AA).
  Fixing either touches shared `Navbar.tsx` or the build's code-splitting —
  out of scope for the hire-page work, flagging here instead.
