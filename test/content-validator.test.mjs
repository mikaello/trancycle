import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the canonical concept files pass relation and review validation", () => {
  const result = spawnSync(process.execPath, ["scripts/validate-content.mjs"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const count = Number(
    result.stdout.match(/Validated (\d+) concept file/)?.[1],
  );
  assert.ok(count >= 147, `Expected at least 147 concepts, received ${count}.`);
});

test("the importer keeps Airtable credentials outside source", async () => {
  const source = await readFile(
    new URL("../scripts/import-airtable.mjs", import.meta.url),
    "utf8",
  );
  assert.match(source, /process\.env\.AIRTABLE_TOKEN/);
  assert.doesNotMatch(source, /pat[A-Za-z0-9]{10,}\./);

  const result = spawnSync(process.execPath, ["scripts/import-airtable.mjs"], {
    encoding: "utf8",
    env: { ...process.env, AIRTABLE_TOKEN: "" },
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Set AIRTABLE_TOKEN/);
});
