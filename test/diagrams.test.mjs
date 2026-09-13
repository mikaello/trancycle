import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { parse } from "yaml";

const source = await readFile(
  new URL("../src/data/diagrams.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { diagrams, diagramHref, diagramsForConcept } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const entries = await Promise.all(
  (await readdir("src/content/terms"))
    .filter((file) => file.endsWith(".md"))
    .map(async (file) => {
      const text = await readFile(`src/content/terms/${file}`, "utf8");
      return parse(text.match(/^---\n([\s\S]*?)\n---/)[1]);
    }),
);
const ids = new Set(entries.map((entry) => entry.id));

test("every diagram resolves stable concept IDs and has source and accessible description", () => {
  assert.equal(new Set(diagrams.map((view) => view.id)).size, diagrams.length);
  for (const view of diagrams) {
    assert.ok(view.alt.length > 30);
    assert.ok(URL.canParse(view.source.url));
    assert.equal(
      new Set(view.parts.map((part) => part.conceptId)).size,
      view.parts.length,
    );
    for (const part of view.parts) {
      assert.ok(
        ids.has(part.conceptId),
        `${view.id}: unknown concept ${part.conceptId}`,
      );
      assert.ok(part.hint);
      assert.ok(diagramsForConcept(part.conceptId).includes(view));
    }
  }
  assert.equal(diagramHref("bicycle"), "/explore/");
  assert.equal(diagramHref("headset"), "/explore/headset/");
});

test("44px markers stay inside the diagram and do not overlap at 320px viewport", () => {
  // 320px viewport minus a 15px scrollbar, 28px shell margin and 2px borders.
  const width = 275;
  const height = (width * 720) / 1000;
  for (const view of diagrams) {
    const rectangles = view.parts.map((part) => {
      const [px, py] = part.point;
      assert.ok(
        px >= 0 && px <= 1000 && py >= 0 && py <= 720,
        `${view.id}: point outside art`,
      );
      const x = (part.marker[0] / 1000) * width;
      const y = (part.marker[1] / 720) * height;
      assert.ok(
        x >= 22 && x <= width - 22 && y >= 22 && y <= height - 22,
        `${view.id}: clipped marker`,
      );
      return { x, y };
    });
    for (let i = 0; i < rectangles.length; i++) {
      for (let j = i + 1; j < rectangles.length; j++) {
        assert.ok(
          Math.abs(rectangles[i].x - rectangles[j].x) >= 44 ||
            Math.abs(rectangles[i].y - rectangles[j].y) >= 44,
          `${view.id}: markers ${i + 1} and ${j + 1} overlap`,
        );
      }
    }
  }
});
