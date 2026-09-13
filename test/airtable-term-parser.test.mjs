import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parse } from "yaml";
import { parseTermField } from "../scripts/parse-airtable-terms.mjs";

test("compact alternatives retain their shared suffix", () => {
  assert.deepEqual(parseTermField("å sykle/dra på bakhjulet"), {
    terms: ["å sykle på bakhjulet", "å dra på bakhjulet"],
    notes: [],
  });
});

test("ordinary alternatives still split outside parentheses", () => {
  assert.deepEqual(parseTermField("tire/tyre").terms, ["tire", "tyre"]);
  assert.deepEqual(parseTermField("(bukke)horn/utsving").terms, [
    "(bukke)horn",
    "utsving",
  ]);
  assert.deepEqual(parseTermField("styre (rør/skaft) vinkel").terms, [
    "styre (rør/skaft) vinkel",
  ]);
});

test("the wheelie concept contains complete Bokmål terms", async () => {
  const markdown = await readFile("src/content/terms/wheelie.md", "utf8");
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/)?.[1];
  assert.ok(frontmatter);
  const concept = parse(frontmatter);

  assert.deepEqual(
    concept.terms.nb.map(({ text }) => text),
    ["å sykle på bakhjulet", "å dra på bakhjulet"],
  );
});
