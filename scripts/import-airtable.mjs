import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { stringify } from "yaml";

const baseId = "appKqB3M4u8nH45um";
const tableId = "tblWCCuYItI28FZyL";
const token = process.env.AIRTABLE_TOKEN;
const outputFlag = process.argv.find((argument) =>
  argument.startsWith("--output-dir="),
);
const outputDirectory = path.resolve(
  outputFlag?.split("=").slice(1).join("=") || "migration/airtable-import",
);

if (!token) {
  throw new Error(
    "Set AIRTABLE_TOKEN in your shell before running the one-time import.",
  );
}

const existing = await readdir(outputDirectory).catch(() => []);
if (existing.some((file) => file.endsWith(".md"))) {
  throw new Error(
    `Refusing to overwrite Markdown files in ${outputDirectory}.`,
  );
}

const records = [];
let offset;

do {
  const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
  url.searchParams.set("pageSize", "100");
  if (offset) url.searchParams.set("offset", offset);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok)
    throw new Error(`Airtable returned HTTP ${response.status}.`);
  const page = await response.json();
  records.push(...page.records);
  offset = page.offset;
} while (offset);

const slugify = (value) =>
  value
    .toLocaleLowerCase("en")
    .replaceAll("æ", "ae")
    .replaceAll("ø", "o")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "concept";

const splitOutsideParentheses = (value) => {
  const parts = [];
  let current = "";
  let depth = 0;

  for (const character of String(value)) {
    if (character === "(") depth += 1;
    if (character === ")") depth = Math.max(0, depth - 1);

    if ((character === "," || character === "/") && depth === 0) {
      if (current.trim()) parts.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
};

const parseTermField = (value) => {
  const notes = [];
  const terms = splitOutsideParentheses(value).map((rawTerm) => {
    let term = rawTerm;
    const leadingNote = term.match(/^\(([^)]+)\)\s+(.+)$/);
    if (leadingNote) {
      notes.push(leadingNote[1]);
      term = leadingNote[2];
    }

    const trailingNote = term.match(/^(.+?)\s+\(([^)]+)\)$/);
    if (trailingNote) {
      term = trailingNote[1];
      notes.push(trailingNote[2]);
    }

    return term.trim();
  });

  return {
    terms: [...new Set(terms.filter(Boolean))],
    notes: [
      ...new Set(
        notes.map(
          (note) => `${note.charAt(0).toLocaleUpperCase()}${note.slice(1)}.`,
        ),
      ),
    ],
  };
};

const domains = {
  component: "Sykkeldeler og utstyr",
  "bike type": "Sykkeltyper",
  other: "Andre sykkelbegrep",
};

const sorted = [...records].sort((left, right) =>
  left.id.localeCompare(right.id),
);
const parsedRecords = sorted.map((record) => ({
  record,
  english: parseTermField(record.fields.Name),
  bokmal: parseTermField(record.fields.Norwegian),
}));
const baseSlugCounts = new Map();
for (const { english } of parsedRecords) {
  const baseSlug = slugify(english.terms[0]);
  baseSlugCounts.set(baseSlug, (baseSlugCounts.get(baseSlug) ?? 0) + 1);
}

const usedSlugs = new Set();
const normalized = parsedRecords.map(({ record, english, bokmal }) => {
  const baseSlug = slugify(english.terms[0]);
  let slug = baseSlug;
  if (baseSlugCounts.get(baseSlug) > 1) {
    slug = `${baseSlug}-${slugify(bokmal.terms[0])}`;
  }
  if (usedSlugs.has(slug))
    slug = `${slug}-${record.id.slice(-6).toLocaleLowerCase("en")}`;
  usedSlugs.add(slug);

  return {
    record,
    english,
    bokmal,
    id: slug,
    slug,
  };
});
const idByRecord = new Map(normalized.map(({ record, id }) => [record.id, id]));

await mkdir(outputDirectory, { recursive: true });

for (const { record, english, bokmal, id, slug } of normalized) {
  const category = String(record.fields.Component ?? "other").toLocaleLowerCase(
    "en",
  );
  const related = [
    ...new Set(
      (record.fields["See also"] ?? [])
        .map((recordId) => idByRecord.get(recordId))
        .filter((relatedId) => relatedId && relatedId !== id),
    ),
  ];
  const toVariants = (values) =>
    values.map((text, index) => ({
      text,
      status: index === 0 ? "preferred" : "admitted",
    }));
  const data = {
    id,
    slug,
    domains: [domains[category] ?? "Andre sykkelbegrep"],
    terms: { en: toVariants(english.terms), nb: toVariants(bokmal.terms) },
    definition: {},
    notes: {
      ...(english.notes.length ? { en: english.notes } : {}),
      ...(bokmal.notes.length ? { nb: bokmal.notes } : {}),
    },
    relations: { broader: [], narrower: [], related },
    sources: [],
    review: { status: "provisional" },
    legacy_category: category,
  };
  const markdown = `---\n${stringify(data, { lineWidth: 0 }).trim()}\n---\n`;
  await writeFile(path.join(outputDirectory, `${slug}.md`), markdown, "utf8");
}

const report = {
  imported_at: new Date().toISOString(),
  record_count: records.length,
  ignored_attachment_count: records.filter((record) => record.fields.Picture)
    .length,
  note: "Airtable attachment URLs are deliberately excluded because they expire and need a separate rights review.",
};
await writeFile(
  path.join(outputDirectory, "import-report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);

console.log(`Imported ${records.length} records into ${outputDirectory}.`);
