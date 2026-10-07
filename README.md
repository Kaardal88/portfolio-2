# Portfolio 2: Kim-André Kårdal

*Ideas in motion.* A portfolio site that also works as my freelance site. It has three featured projects, each with its own article page, and a Lab page for side projects.

Built with [Astro](https://astro.build). The animated "brain" on the home page uses plain Canvas 2D and TypeScript, with no animation libraries.

## Getting started

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build in dist/
npm run preview  # preview the production build
```

## Where things live

| What | Where |
| --- | --- |
| Site settings (email, links, idea counter) | `src/site.config.ts` |
| Project articles (one file per project) | `src/content/projects/*.md` |
| Lab: hobbies and "successfully failed" projects | `src/content/lab/*.json` |
| Content schema (the fields each file must have) | `src/content.config.ts` |
| Design tokens (colours, type, spacing) | `src/styles/tokens.css` |
| Brain animation | `src/scripts/brain.ts` and `src/components/Brain.astro` |
| Contact form | `src/components/ContactForm.astro` |
| Images | `public/images/…` |

All content is kept separate from the layout, so a headless CMS can replace the Markdown and JSON files later without any page needing to be rewritten.

### Adding a project

1. Copy one of the files in `src/content/projects/` and rename it. The file name becomes the URL (`/work/<file-name>/`).
2. Fill in the front matter. The build fails with a clear error message if a required field is missing.
3. Add screenshots to `public/images/<project>/` and reference them as `/images/<project>/cover.webp`.

## Contact form

The form uses [Web3Forms](https://web3forms.com), so the site stays static and needs no server.

1. Get a free access key from Web3Forms using the email address that should receive messages.
2. Copy `.env.example` to `.env` and paste in the key.
3. On your host (Netlify, Vercel or similar), add the same `PUBLIC_WEB3FORMS_KEY` environment variable.

## Before going live

- [ ] Replace every `[placeholder]` (search the project for `[`)
- [ ] Set `site` in `astro.config.mjs` to the real domain
- [ ] Add `public/og-image.png` (1200 × 630) for link previews
- [ ] Add screenshots and alt text for each project
- [ ] Add the contact form key
- [ ] Run Lighthouse on the home page and one article page

## Accessibility and performance

- The brain respects `prefers-reduced-motion` and pauses when it is off screen.
- Project nodes in the brain are real links and can be reached with the keyboard. On touch screens, the first tap focuses a node and the second tap opens it.
- All interactive elements have visible focus states and touch targets of at least 44 px.
