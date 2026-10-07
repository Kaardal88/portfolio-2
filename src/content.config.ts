import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

/*
 * All site content lives in src/content/. Pages only render it.
 * Keeping content separate from layout is what makes it easy to plug in
 * a headless CMS later without rewriting the pages.
 */

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    category: z.string(), // e.g. "Client web app · Mjøs Metall"
    summary: z.string(),
    shortSummary: z.string(), // one line, used on the home page card
    badge: z.string().optional(), // e.g. "Used in teaching"
    role: z.string(),
    year: z.string(),
    stack: z.array(z.string()),
    client: z.string().optional(),
    liveUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    cover: z.string().optional(), // path under /public, e.g. /images/machine-park/cover.webp
    coverAlt: z.string().optional(),

    // Position in the brain on the home page (0–1 of the width / height).
    brain: z.object({
      label: z.string(),
      x: z.number(),
      y: z.number(),
      mobileX: z.number(),
      mobileY: z.number(),
      side: z.enum(["left", "right"]),
    }),

    features: z
      .array(
        z.object({
          title: z.string(),
          text: z.string(),
          icon: z
            .enum([
              "filter",
              "specs",
              "sort",
              "chart",
              "lock",
              "layout",
              "spark",
            ])
            .default("spark"),
        }),
      )
      .default([]),

    decisions: z
      .array(z.object({ choice: z.string(), why: z.string() }))
      .default([]),

    reflection: z.object({
      learned: z.string(),
      failed: z.string(),
      next: z.string(),
    }),
  }),
});

const hobbies = defineCollection({
  loader: file("./src/content/lab/hobbies.json"),
  schema: z.object({
    category: z.enum(["music", "games", "art", "wood"]),
    categoryLabel: z.string(),
    title: z.string(),
    status: z.string(),
    statusTone: z.enum(["active", "ongoing", "new"]),
    hint: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imagePlaceholder: z.string(),
    specs: z.array(z.object({ label: z.string(), value: z.string() })),
  }),
});

const failed = defineCollection({
  loader: file("./src/content/lab/failed.json"),
  schema: z.object({
    when: z.string(),
    title: z.string(),
    idea: z.string(),
    progress: z.number().min(0).max(100),
    lesson: z.string(),
  }),
});

export const collections = { projects, hobbies, failed };
