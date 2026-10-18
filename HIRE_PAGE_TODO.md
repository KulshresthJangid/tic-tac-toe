# /hire page — still needs before it's fully live

`src/pages/Hire.tsx` ships with literal `[BRACKETED]` placeholders. Fill these in,
then redeploy:

1. **`CALENDLY_LINK`** — real Calendly URL for "Book a 20-min intro call".
2. **`OVERLAP_HOURS`** — appears twice (FAQ + "how I work" subtext). How many
   hours of real-time overlap with US business hours you're actually
   committing to.
3. **`WEB3FORMS_ACCESS_KEY`** — the contact form has no backend of its own
   (static SPA), wired to [Web3Forms](https://web3forms.com) (free, just an
   email-verified key, no account needed). Until a real key is in, the form
   shows an inline "email me directly" message instead of silently failing.
4. **`[X weeks]`** — typical timeline on each of the 3 offer cards.

## Known, pre-existing — not introduced by this page
- `og-image.png` is referenced site-wide (including now `/hire`) but doesn't
  exist in `public/` or `dist/` — every page's OG preview is currently broken.
- Lighthouse on `/hire`: Performance 89–90, Accessibility 94, Best Practices
  100, SEO 100. The homepage scores 92/96 on the same two under identical
  local conditions — driven by the whole site being one unsplit SPA bundle
  and the nav's `text-white/40` inactive-link contrast (fails WCAG AA).
  Fixing either touches shared `Navbar.tsx` or the build's code-splitting —
  out of scope for the hire-page work, flagging here instead.
