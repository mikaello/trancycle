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

const splitTerms = (value) =>
  String(value)
    .split(/\s*(?:,|\/)\s*/)
    .map((term) => term.trim())
    .filter(Boolean);

const domains = {
  component: "Sykkeldeler og utstyr",
  "bike type": "Sykkeltyper",
  other: "Andre sykkelbegrep",
};

const sorted = [...records].sort((left, right) =>
  left.id.localeCompare(right.id),
);
const slugCounts = new Map();
const normalized = sorted.map((record) => {
  const baseSlug = slugify(record.fields.Name);
  const number = (slugCounts.get(baseSlug) ?? 0) + 1;
  slugCounts.set(baseSlug, number);
  return {
    record,
    id: `tc-${record.id.slice(3).toLocaleLowerCase("en")}`,
    slug: number === 1 ? baseSlug : `${baseSlug}-${number}`,
  };
});
const idByRecord = new Map(normalized.map(({ record, id }) => [record.id, id]));

await mkdir(outputDirectory, { recursive: true });

for (const { record, id, slug } of normalized) {
  const english = splitTerms(record.fields.Name);
  const bokmal = splitTerms(record.fields.Norwegian);
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
    terms: { en: toVariants(english), nb: toVariants(bokmal) },
    definition: {},
    notes: {},
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
