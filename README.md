# Portfolio 2: Kim-André Kårdal

*Ideas in motion.* A portfolio site that also works as my freelance site. It has three featured projects, each with its own article page, and a Lab page for side projects.

<img width="1190" height="1095" alt="og-image" src="https://github.com/user-attachments/assets/879f6773-e0d6-4046-999a-559c4f1d4c08" />


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


## Contact form

The form uses [Web3Forms](https://web3forms.com), so the site stays static and needs no server.




