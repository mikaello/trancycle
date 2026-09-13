import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the canonical concept files pass relation and review validation", () => {
  const result = spawnSync(process.execPath, ["scripts/validate-content.mjs"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Validated \d+ concept file/);
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
