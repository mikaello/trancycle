import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = path.resolve("dist");
const basePath = process.env.ASTRO_BASE
  ? `/${process.env.ASTRO_BASE.replace(/^\/+|\/+$/g, "")}/`
  : "/";
const distPath = (urlPath) => {
  const withoutBase =
    basePath === "/"
      ? urlPath
      : urlPath === basePath.slice(0, -1)
        ? "/"
        : urlPath.startsWith(basePath)
          ? urlPath.slice(basePath.length - 1)
          : urlPath;
  return path.join(root, decodeURIComponent(withoutBase));
};
async function walk(directory) {
  const results = await Promise.all(
    (await readdir(directory, { withFileTypes: true })).map((entry) =>
      entry.isDirectory()
        ? walk(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    ),
  );
  return results.flat();
}
const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const documents = new Map(
  await Promise.all(
    htmlFiles.map(async (file) => [file, await readFile(file, "utf8")]),
  ),
);
let diagrams = 0;
let largestSvg = 0;
let largestScript = 0;
for (const [file, html] of documents) {
  const pageUrl = new URL(
    path.relative(root, file).replace(/index\.html$/, ""),
    "https://trancycle.test/",
  );
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate HTML IDs`);
  for (const match of html.matchAll(/\shref="([^"?#]*[^" ]*)"/g)) {
    const raw = match[1].replaceAll("&amp;", "&");
    const url = new URL(raw, pageUrl);
    if (url.origin !== pageUrl.origin) continue;
    let target = distPath(url.pathname);
    if (url.pathname.endsWith("/")) target = path.join(target, "index.html");
    assert.ok(await stat(target).catch(() => false), `${file}: missing ${raw}`);
    if (url.hash && documents.has(target)) {
      assert.ok(
        documents
          .get(target)
          .includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `${file}: missing anchor ${raw}`,
      );
    }
  }
  if (!html.includes("data-explorer")) continue;
  diagrams++;
  const art = html.match(/<svg class="diagram-art"[\s\S]*?<\/svg>/)?.[0];
  assert.ok(art, `${file}: missing static diagram`);
  largestSvg = Math.max(largestSvg, gzipSync(art).length);
  assert.ok(gzipSync(art).length < 150_000, `${file}: SVG budget exceeded`);
  const details = [
    ...html.matchAll(/<article\b[^>]*data-detail="([^"]+)"[^>]*>/g),
  ];
  assert.ok(details.length >= 7, `${file}: missing static text equivalents`);
  for (const detail of details) {
    assert.ok(
      !/\shidden(?:\s|=|>)/.test(detail[0]),
      `${file}: detail hidden without JavaScript`,
    );
    assert.ok(
      html.includes(`href="#part-${detail[1]}"`),
      `${file}: missing annotation link`,
    );
  }
  const scripts = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/type="application\/(?:ld\+)?json"/.test(match[1])) continue;
    const src = match[1].match(/src="([^" ]+)"/)?.[1];
    scripts.push(
      src
        ? await readFile(distPath(new URL(src, pageUrl).pathname), "utf8")
        : match[2],
    );
  }
  assert.ok(scripts.length > 0, `${file}: missing progressive enhancement`);
  // Astro may inline small scripts, so measure inline and external code together.
  const scriptSize = gzipSync(scripts.join("\n")).length;
  largestScript = Math.max(largestScript, scriptSize);
  assert.ok(scriptSize < 10_000, `${file}: combined script budget exceeded`);
}
assert.equal(diagrams, 5, "Expected all five static diagram pages");
console.log(
  `Validated links and anchors across ${htmlFiles.length} pages; ${diagrams} static diagrams. Largest SVG: ${largestSvg} B gzip; largest script: ${largestScript} B gzip.`,
);
