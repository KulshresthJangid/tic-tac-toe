# Testimonials — approval checklist

The testimonials on Home and About (`src/data/testimonials.ts`) are all
**drafts written by Claude**, not real quotes. Every entry has
`approved: false` and renders with a visible "draft · unconfirmed" badge.

**Do not deploy this feature until every entry you keep has been confirmed
by the person it's attributed to.** Two acceptable outcomes per person:

1. They read the draft quote, are fine with it as-is or with edits →
   update `quote` in `testimonials.ts` to their final wording, set
   `approved: true`.
2. They'd rather write their own → replace the quote entirely with what
   they actually send you.

If someone doesn't respond or isn't comfortable being quoted, delete their
entry rather than publishing it unconfirmed.

## Suggested outreach message (customize per person)

> Hey [name] — I'm adding a short testimonials section to my portfolio
> (buildwithkulshresth.com) and would love to include a line from you.
> I drafted something based on [our work together at CarDekho /
> the Bombaywala project / etc.] — totally fine to edit, cut, or replace
> with your own words:
>
> "[paste their draft quote]"
>
> No pressure if you'd rather skip it — just let me know either way.

## Status

| Person | Role / Company | Sent? | Confirmed? |
|---|---|---|---|
| Vidosh Sahu | AVP Engineering, CarDekho | ☐ | ☐ |
| Abhinav Faujdar | Software Engineer | ☐ | ☐ |
| Nikhil Saini | Founder, Bombaywala Marketing | ☐ | ☐ |
| Rishabh Mandawariya | Frontend Engineer | ☐ | ☐ |
| Vishal Upadhyay | Engineer | ☐ | ☐ |
| Prashant Sankhla | Engineer | ☐ | ☐ |

Note: I could only confirm Vidosh Sahu's (CarDekho) and Abhinav Faujdar's
(Jaipur-based engineer) public profiles with any confidence — the other
three names matched multiple unrelated people online, so double check
you're sending this to the right person / right contact info for each.
