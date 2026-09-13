import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const termVariant = z.object({
  text: z.string().min(1),
  status: z.enum([
    "preferred",
    "admitted",
    "colloquial",
    "regional",
    "deprecated",
  ]),
});

const terms = defineCollection({
  loader: glob({ base: "./src/content/terms", pattern: "**/*.md" }),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    domains: z.array(z.string().min(1)).min(1),
    terms: z.record(z.string(), z.array(termVariant).min(1)),
    definition: z.record(z.string(), z.string()).default({}),
    notes: z.record(z.string(), z.array(z.string())).default({}),
    relations: z
      .object({
        broader: z.array(z.string()).default([]),
        narrower: z.array(z.string()).default([]),
        related: z.array(z.string()).default([]),
      })
      .default({ broader: [], narrower: [], related: [] }),
    sources: z
      .array(
        z.object({
          title: z.string(),
          publisher: z.string().optional(),
          url: z.url(),
          applies_to: z.array(z.string()).default([]),
        }),
      )
      .default([]),
    review: z.object({
      status: z.enum(["provisional", "reviewed"]),
      last_reviewed: z.coerce.date().optional(),
      reviewer: z.string().optional(),
    }),
    legacy_category: z.string().optional(),
  }),
});

export const collections = { terms };
