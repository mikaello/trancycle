import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

const contentDirectory = path.resolve("src/content/terms");
const files = (await readdir(contentDirectory)).filter((file) =>
  file.endsWith(".md"),
);
const entries = [];

for (const file of files) {
  const source = await readFile(path.join(contentDirectory, file), "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  assert(match, `${file}: front matter is missing or malformed`);
  entries.push({ file, data: parse(match[1]) });
}

const uniqueValues = (key) => {
  const seen = new Map();
  for (const entry of entries) {
    const value = entry.data[key];
    assert(value, `${entry.file}: ${key} is required`);
    assert(
      !seen.has(value),
      `${entry.file}: duplicate ${key} '${value}' also appears in ${seen.get(value)}`,
    );
    seen.set(value, entry.file);
  }
  return new Set(seen.keys());
};

const ids = uniqueValues("id");
uniqueValues("slug");

for (const entry of entries) {
  for (const language of ["en", "nb"]) {
    const variants = entry.data.terms?.[language] ?? [];
    assert(
      variants.length > 0,
      `${entry.file}: terms.${language} must contain at least one term`,
    );
    assert(
      variants.filter(({ status }) => status === "preferred").length === 1,
      `${entry.file}: terms.${language} must contain exactly one preferred term`,
    );
  }

  if (entry.data.review?.status === "reviewed") {
    assert(
      entry.data.review.last_reviewed,
      `${entry.file}: reviewed concepts need a review date`,
    );
    assert(
      entry.data.sources?.length > 0,
      `${entry.file}: reviewed concepts need at least one source`,
    );
  }

  for (const [relation, targets] of Object.entries(
    entry.data.relations ?? {},
  )) {
    for (const target of targets) {
      assert(
        target !== entry.data.id,
        `${entry.file}: ${relation} relation points to itself`,
      );
      assert(
        ids.has(target),
        `${entry.file}: ${relation} relation points to missing concept '${target}'`,
      );
    }
  }
}

console.log(
  `Validated ${entries.length} concept file${entries.length === 1 ? "" : "s"}.`,
);
