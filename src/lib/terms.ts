import type { CollectionEntry } from "astro:content";

export type TermEntry = CollectionEntry<"terms">;

export function sitePath(path: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base}${path.replace(/^\/+/, "")}`;
}

export const languageNames: Record<string, string> = {
  en: "English",
  nb: "Norsk bokmål",
  nn: "Norsk nynorsk",
};

export function preferredTerm(entry: TermEntry, language: string): string {
  const variants = entry.data.terms[language] ?? [];
  return (
    variants.find((variant) => variant.status === "preferred")?.text ??
    variants[0]?.text ??
    "—"
  );
}

export function alternativeTerms(entry: TermEntry, language: string) {
  const preferred = preferredTerm(entry, language);
  return (entry.data.terms[language] ?? []).filter(
    (variant) => variant.text !== preferred,
  );
}

export function byPreferredTerm(language: string) {
  return (left: TermEntry, right: TermEntry) =>
    preferredTerm(left, language).localeCompare(
      preferredTerm(right, language),
      language,
      {
        sensitivity: "base",
      },
    );
}

export function termHref(entry: TermEntry): string {
  return sitePath(`/term/${entry.data.slug}/`);
}

export function allSearchText(entry: TermEntry): string {
  return [
    ...Object.values(entry.data.terms).flatMap((variants) =>
      variants.map(({ text }) => text),
    ),
    ...Object.values(entry.data.definition),
    ...entry.data.domains,
  ].join(" ");
}
