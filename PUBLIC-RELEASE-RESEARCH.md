# Trancycle public release strategy

## Executive recommendation

Trancycle should launch as a static, bilingual cycling glossary whose canonical content lives in this Git repository.

Astro is the best fit of the four candidate generators because it combines static HTML by default, schema-validated content collections, a built-in image pipeline, and an escape hatch for the small amount of JavaScript needed for search and theme selection.^5 ^6 ^7

GitHub Pages is sufficient hosting for the initial public release because the project is public, non-transactional, very small, and compatible with a custom static-site build through GitHub Actions.^12

Airtable should not be queried by visitors or required at build time after migration.

The current base contains 147 records, and its public textual projection is small enough to ship in the initial HTML or a tiny local search index without a server.

Keeping Airtable in the runtime path would add a permanent secret, an external availability dependency, API limits, and expiring attachment URLs without improving the visitor experience.^13 ^14 ^15

The public product should have two complementary surfaces:

- A fast index page where every term can be searched in English or Norwegian, browsed alphabetically, and filtered by subject.

- A stable detail page for every concept with preferred terms, alternatives, definition, usage notes, related concepts, references, image attribution, and a correction link.

The most valuable pre-launch work is not adding framework features.

It is restructuring the content from translation pairs into concept records, separating synonyms from explanations, adding definitions and sources, and clearing the rights to every image.

The launch can still be deliberately small.

A credible first version needs excellent search, stable links, clear provenance, and perhaps one strong annotated bicycle diagram rather than 147 mediocre or legally uncertain pictures.

## Current collection audit

The Airtable base was inspected through its read-only API on 13 September 2026.^1

It contains 147 records distributed as follows:

| Current category | Records | Share |
|---|---:|---:|
| component | 118 | 80% |
| other | 17 | 12% |
| bike type | 12 | 8% |

Every record has values in `Name`, `Norwegian`, and `Component`.

Only three records have a picture, 24 records have at least one `See also` value, and the relation field contains 31 links in total.

Three `See also` links point back to their own record.

There are no dangling related-record links.

Thirty Norwegian values contain comma-separated alternatives, and five English values contain slash-separated alternatives.

That means the visual table currently hides meaningful structure inside strings.

For example, preferred translations, accepted alternatives, colloquial words, regional forms, parenthetical definitions, and usage labels cannot currently be displayed or searched independently.

Exact duplicate English labels include `drop`, `manual`, and `reach`.

Those are not necessarily duplicate concepts: each word has distinct cycling senses, which is precisely why a concept identifier and a definition are needed.

Exact duplicate Norwegian values include `nav`, `boss`, `slange`, `utforsykling`, `utforsykkel`, `krank`, `vaier`, and `tannhjul (i kassetten)`.

Some reflect English spelling variants or synonyms, while others may warrant consolidation after editorial review.

The current category called `component` also includes tools, apparel, geometry, setup parameters, and terrain terms.

This makes the category useful as a migration hint but not as the final public taxonomy.

The data is therefore suitable for launch after normalization, but it should not be published as a raw Airtable grid or a literal CSV table.

## What already exists

No discovered service makes Trancycle redundant.

The closest Norwegian resources are either broader language infrastructure or much narrower cycling lists.

Termportalen is Norway's national portal for specialist terminology and searches across domains, termbases, and languages.

Most participating termbases include Bokmål, Nynorsk, and English, and the project explicitly invites owners of terminology resources to make contact.^4

Termportalen is the strongest potential distribution partner, but it is not a reason to avoid a focused Trancycle website.

A focused site can offer cycling-specific browsing, illustrations, direct correction links, downloadable data, and an editorial voice while later supplying the same structured terms to the national infrastructure.

Språkrådet distinguishes simple translation lists from richer termbases and explicitly recommends definitions because they help a reader decide whether a translation expresses the intended concept.^3

That observation is especially important for ambiguous entries such as `manual`, `drop`, `reach`, and `headset`.

Oslo municipality and Syklistenes Landsforening published a small illustrated cycling word list across Norwegian, English, Somali, Arabic, Farsi, and Urdu for introductory cycling instruction.^20

It demonstrates a real need for approachable, multilingual cycling language, but its scope is basic road-safety vocabulary rather than specialist components, geometry, maintenance, and mountain-bike language.

The Norwegian Wikimedia Commons bicycle diagram provides a ready-made example of an overview illustration with labeled Norwegian components under CC BY-SA 4.0.^19

It can be linked immediately and potentially reused with exact attribution and ShareAlike compliance after checking whether its labels match Trancycle's editorial choices.

English cycling references demonstrate several useful presentation patterns:

- Sheldon Brown's glossary provides durable alphabetic navigation, definitions, cross-links, and an explicit editorial point of view.^16

- Bicycles Stack Exchange's community terminology index asks for one concept per entry, an image where applicable, and links to detailed sources.^17

- Park Tool combines search, categories, an interactive bicycle diagram, concise summaries, photographs, and deeper repair articles.^18

These products also reveal what Trancycle should avoid.

A giant alphabetic document is easy to publish but difficult to scan on a phone, a community wiki can accumulate uneven quality, and copying manufacturer or reference-site prose and pictures creates licensing and maintenance problems.

Trancycle's opportunity is a narrower, cleaner, source-conscious Norwegian experience rather than another encyclopedic English cycling guide.

## Where the data should live

### Recommended source of truth

Use one Markdown file per concept in `src/content/terms/`, with structured YAML front matter and optional longer editorial notes in the Markdown body.

Generate JSON and CSV downloads from those files during the build.

This arrangement provides readable reviews, small diffs, stable links, validation, and room for prose without forcing contributors to edit one large data file.

A single JSON file would be acceptable for 147 short pairs, but it becomes unpleasant when each entry gains definitions, sources, relations, review metadata, and licensed images.

CSV should be an export format, not the canonical format, because arrays, typed relations, multiline descriptions, and image attribution do not fit it safely.

Airtable can remain available for a short migration window, but it should be frozen or clearly marked as non-canonical after cutover.

If a nontechnical editorial workflow later becomes a real need, reintroduce a CMS only after identifying who edits, how often, and which review controls are missing from pull requests.

Do not design that complexity into version one speculatively.

### Why Airtable should leave the delivery path

Airtable's Web API is limited to five requests per second per base, and Free and Team workspaces also have monthly call caps.^13

Those limits are not dangerous for a build-time export of 147 records, but they are unnecessary exposure for a public read-only catalogue.

A browser must never receive a personal access token.

A server-side proxy would hide the token, but it would turn an otherwise static glossary into an operated service with caching, error handling, and cost.

Airtable download URLs for attachments expire after a short period, with a guaranteed window of at least two hours, and Airtable explicitly discourages using them as a public CDN.^14

Therefore every published image must be stored locally in the repository or in a deliberate asset host with stable licensing metadata.

Personal access tokens remain active until deleted, regenerated, or modified, and can be limited by scope and resource.^15

Because the token used for this assessment appeared in the conversation, it should be regenerated or deleted now even if it was read-only.

### Proposed concept schema

The schema should model a concept first and attach one or more language terms to it.

This follows Termlosen's principle that each term record represents one concept and that a word denoting multiple concepts belongs in separate records.^2

```yaml
---
id: bicycle-headset
slug: headset
domains:
  - frame-and-fork
  - steering
terms:
  en:
    - text: headset
      status: preferred
  nb:
    - text: styrelager
      status: preferred
definition:
  nb: Lagerenheten som lar gaffel og styre rotere i sykkelens styrerør.
notes:
  nb:
    - Må ikke forveksles med høretelefoner i denne betydningen.
relations:
  broader: []
  narrower: []
  related:
    - head-tube
    - steerer-tube
sources:
  - title: Headset Service
    publisher: Park Tool
    url: https://www.parktool.com/blog/repair-help
    applies_to:
      - definition
images:
  - path: ./headset.webp
    alt_nb: Styrelager montert mellom gaffelens kronerør og rammens styrerør.
    creator: Example Creator
    source_url: https://example.org/original
    license: CC-BY-4.0
review:
  status: draft
  last_reviewed: 2026-09-13
---
```

The exact wording above is illustrative rather than an approved term entry.

The minimum required fields for launch should be `id`, `slug`, one English term, one Bokmål term, at least one domain, and editorial status.

Definitions and references can be introduced progressively, but the site should visually distinguish reviewed entries from provisional ones.

Recommended fields are:

| Field | Purpose |
|---|---|
| `id` | Stable concept identifier that never changes with spelling |
| `slug` | Human-readable, permanent URL segment |
| `terms.<lang>[]` | Separate preferred, admitted, colloquial, regional, and deprecated forms |
| `definition.<lang>` | Original definition of the concept, not a synonym list |
| `notes.<lang>[]` | Usage, ambiguity, dialect, British/American, or technical notes |
| `domains[]` | Faceted subject classification |
| `relations` | Typed broader, narrower, and related concept links |
| `sources[]` | Claim-level references with publisher, URL, and scope |
| `images[]` | Local path, alt text, caption, creator, source, and license |
| `review` | Draft/reviewed status, reviewer, and review date |

Use explicit BCP 47 language keys such as `en`, `nb`, and later `nn` rather than the undifferentiated label `Norwegian`.

Do not split polysemous labels merely to make labels unique.

The concepts for a repair manual and the riding technique called a manual should keep separate stable IDs and definitions even though the English display text is identical.

### Taxonomy

Replace the three current categories with a small controlled hierarchy and allow several tags per concept.

A practical initial taxonomy is:

- Bicycle types

- Frame, fork, and geometry

- Cockpit and contact points

- Drivetrain and shifting

- Brakes

- Wheels, tyres, and tubeless systems

- Suspension

- Tools and maintenance

- Clothing and protection

- Riding skills and terrain

- Disciplines and race formats

Keep this list intentionally short.

More granular groups should emerge from navigation needs, not from a desire to classify every nuance before launch.

## Static generator decision

Every candidate can produce a fast static glossary, so generator benchmarks are not the deciding factor at this scale.

The meaningful differences are content validation, image handling, contributor ergonomics, deployment complexity, and the ease of adding a small interactive search experience.

| Criterion | Astro | Hugo | Eleventy | Jekyll |
|---|---|---|---|---|
| Static HTML | Excellent and default | Excellent | Excellent | Excellent |
| Structured-content validation | Excellent, schema and generated types | Good, with templates or validation scripts | Flexible, usually custom validation | Basic without custom plugins/scripts |
| Rich Markdown term pages | Excellent | Excellent | Excellent | Excellent |
| Local image pipeline | Built in | Built in and very capable | Official plugin available | Additional tooling usually needed |
| Small client interaction | Straightforward vanilla JS or islands | Straightforward vanilla JS | Straightforward JavaScript | Straightforward vanilla JS |
| One-language toolchain | Node/TypeScript | Go binary, plus Node if using Pagefind | Node | Ruby, plus Node if using modern search/image tools |
| GitHub Pages | Custom Action | Custom Action | Custom Action | Native or custom Action |
| Fit for Trancycle | Best balance | Strong runner-up | Good minimalist option | Viable but fourth choice |

### Astro

Astro content collections can load Markdown, YAML, or JSON at build time and validate their shape with a schema, including typed references between entries.^5

That directly addresses Trancycle's main risk: inconsistent content as the schema grows.

Astro components render to HTML and CSS without client JavaScript unless interactivity is explicitly requested.^6

Its image components can resize and optimize local assets at build time.^7

The resulting site is not a client-rendered application.

Only the search filter and explicit theme toggle need a small script.

### Hugo

Hugo is the strongest alternative if a single native binary and exceptionally mature content tooling are preferred.

It reads local JSON, YAML, TOML, XML, and other data sources, has robust multilingual support, and performs cached image transformations during builds.^8 ^9

It loses narrowly because the proposed nested term schema and relation checks are more natural to validate and transform in TypeScript, and a Node step is likely to return anyway if Pagefind is adopted.

Choose Hugo instead if the maintainer already prefers Go templates or wants to minimize the JavaScript package ecosystem.

### Eleventy

Eleventy is compact, flexible, and friendly to plain HTML.

It exposes JSON and JavaScript global data to templates and can generate pages from collections.^10

It would be a sound choice for a handcrafted glossary, but Trancycle would need to assemble more of the schema validation, content-reference checking, and image workflow itself.

That flexibility is valuable for unusual sites and less valuable for a small project that benefits from guardrails.

### Jekyll

Jekyll can load JSON, YAML, CSV, and TSV data and generate pages from collections.^11

Its native relationship with GitHub Pages is convenient, but GitHub Pages now supports custom Actions for any generator, so this advantage is smaller than it once was.^12

For this project, Ruby plus any additional modern search and image tooling is more operational surface than Astro's single Node toolchain.

Jekyll remains reasonable if the desired result is a nearly script-free table and the maintainer is already comfortable with Liquid and Ruby.

## Search recommendation

Version one should render the full compact index as HTML and progressively enhance it with a dependency-free client-side filter.

At 147 entries, filtering normalized text in the existing page is effectively instant and requires no server, external search provider, or large search library.

The index should search English terms, Bokmål terms, alternatives, definitions, and tags.

It should prioritize exact preferred-term matches, then prefix matches, then substring matches.

Normalize case and Unicode consistently, but do not make `å`, `æ`, and `ø` indistinguishable from unrelated Latin letters by default.

Display a live result count, preserve the query in the URL, and make the result list usable with the keyboard and screen readers.

When the collection grows to several hundred rich pages, Pagefind is the appropriate upgrade.

Pagefind builds a completely static search index after site generation, needs no server component, and has Norwegian Bokmål interface translation and stemming support.^21

It works with any static generator, so adopting it later does not affect the Astro decision.

## Public experience

### Index page

The page should open with one sentence explaining the product and a visually dominant search field labeled `Søk på engelsk eller norsk`.

Results should appear immediately below as quiet, high-density rows rather than decorative cards.

On desktop, each row can use aligned columns for English, Bokmål, domain, and a short definition.

On mobile, the same row should stack the preferred Norwegian term beneath the English term and keep metadata secondary.

The default order should be alphabetical by English because the original use case begins with an English term, with a visible option to sort by Norwegian.

Useful controls are:

- One search field across both languages

- English/Norwegian sort direction

- Domain filters

- An A–Å jump list when sorted by Norwegian and an A–Z list when sorted by English

- A clear-results control

- A visible result count

The unfiltered list must remain visible if JavaScript fails.

### Concept page

Each concept deserves a stable URL such as `/term/headset/`.

The page should present:

1. Preferred English and Bokmål terms with language labels.

2. Accepted alternatives, colloquial forms, and deprecated terms with status labels.

3. A short original definition.

4. A usage or disambiguation note when necessary.

5. A focused image or diagram when it materially identifies the concept.

6. Broader, narrower, and related concepts.

7. Sources with the specific claim or field they support.

8. Review status and last-reviewed date.

9. `Foreslå en rettelse`, linking to a prefilled GitHub issue for that concept.

This design makes individual concepts linkable from forums, articles, shops, and translation work.

It also allows search engines to index useful text rather than a JavaScript-only database.

Schema.org defines `DefinedTermSet` for glossaries and `DefinedTerm` for entries, so the build can emit JSON-LD with stable concept URLs.^22

This markup improves machine-readable semantics, although it should not be presented as a promise of a special Google rich result.

### Theme and responsive behavior

Support the operating-system theme automatically with `color-scheme` and `prefers-color-scheme`, then provide an optional three-state control for system, light, and dark.^23

Store only the explicit override locally and avoid a flash of the wrong theme before CSS loads.

Use the same restrained visual hierarchy in both themes rather than treating dark mode as an inverted novelty.

The layout should work without horizontal scrolling at 320 CSS pixels and should expand into a comfortable reading column rather than stretching rows across an ultrawide display.

Make all primary controls at least 44 by 44 CSS pixels as a practical touch target, which exceeds WCAG 2.2's 24 by 24 minimum and meets its enhanced target-size recommendation.^24

Text and interactive states should meet WCAG 2.2 AA contrast requirements in both modes.^25

Respect reduced-motion preferences and never rely on colour alone to show preferred, admitted, or deprecated status.

## Definitions, references, and editorial quality

Termlosen recommends a structured term record and treats a preferred term plus a definition as the minimum information for standardization work.^2

Trancycle does not need to claim formal standardization, but the same structure will make it more trustworthy.

Write definitions in original language and cite the references used to verify the concept.

Do not copy definitions wholesale from dictionaries, manufacturers, Park Tool, Sheldon Brown, or Wikipedia unless their license and required attribution are compatible with Trancycle's content license.

Links can be used without importing the source's prose or image.

Use a source hierarchy:

1. Norwegian terminology authorities and official dictionaries for language status.

2. Standards and governing bodies for standardized dimensions or competition formats.

3. Manufacturer technical manuals for product-specific mechanisms and names.

4. Established repair references for practical explanations.

5. Community references for emerging slang, with explicit provisional status.

An entry can cite different sources for different claims.

For example, a Norwegian term choice can cite a language resource while a mechanical definition cites a technical manual.

Editorial status should be visible but simple:

- `reviewed` means terminology, definition, and citations have been checked by a named reviewer.

- `provisional` means useful but still awaiting subject or language review.

- `deprecated` applies to a term variant, not to the whole concept.

Launch copy should describe Trancycle as a community-maintained translation glossary, not an official standard, until an appropriate institution or editorial group formally supports it.

## Image strategy

Pictures should be added selectively and legally, not as a completeness counter.

Prioritize images for visually confusable parts and spatial concepts such as `head tube`, `steerer tube`, `crown race`, `dropout`, `trail`, `rake`, `reach`, and `stack`.

Geometry and assembly concepts are often clearer in a diagram than in a photograph.

A good sequence is:

1. Publish one licensed overview diagram of a complete bicycle.

2. Create a small set of original vector diagrams for geometry, suspension, drivetrain, and wheel anatomy.

3. Add original photographs for parts where real-world appearance matters.

4. Import third-party open images only when creator, source URL, license, and modification history can be recorded.

The Norwegian Wikimedia bicycle diagram is available under CC BY-SA 4.0 and requires attribution, a license link, and ShareAlike treatment for adaptations.^19

Store an approved copy locally rather than hotlinking it.

For every image, require alt text that identifies the concept, a short caption when useful, intrinsic dimensions to avoid layout shift, and machine-readable attribution metadata.

Do not publish the current Airtable attachment URLs because they expire and are not intended as a CDN.^14

## Licensing and public reuse

The repository currently declares no license.

Before release, choose licenses separately for code, original terminology content, and third-party media.

A practical default is MIT for code and CC BY 4.0 for original glossary content and database rights.

CC BY 4.0 permits sharing and adaptation, including commercial reuse, when attribution is provided, and version 4.0 addresses sui generis database rights.^26

CC0 is an even stronger option if maximum reuse matters more than requiring attribution.

CC BY-SA 4.0 is appropriate if adaptations should remain open, but it adds compatibility considerations when mixing imported material.

Do not apply the project's blanket license to third-party images or copied text.

Creative Commons recommends marking exactly which elements are licensed and clearly identifying third-party rights.^27

An `ATTRIBUTION.md` file and per-image metadata should make those boundaries explicit.

This section is a product recommendation, not legal advice.

## Build and publication architecture

```text
Markdown concept files + local licensed images
                    |
                    v
         Astro schema validation
                    |
          +---------+----------+
          |                    |
          v                    v
   Static HTML pages      JSON + CSV exports
          |
          v
  Optional Pagefind index
          |
          v
 GitHub Actions -> GitHub Pages
```

The build should fail when:

- A required language term is missing.

- A stable ID or slug is duplicated.

- A relation points to a missing concept or to itself.

- A preferred term is repeated within the same concept and language.

- An image lacks alt text, creator, source, or license metadata.

- A reviewed entry lacks at least one source and a review date.

The build should generate:

- One index page and one page per concept.

- `/data/terms.json` for machines and reuse.

- `/data/terms.csv` for translators and spreadsheet users.

- A sitemap, canonical URLs, Open Graph metadata, and `DefinedTerm` JSON-LD.

- A compact search payload or Pagefind index.

GitHub Pages accepts output from any static-site generator through a custom Actions workflow, and its published-site, bandwidth, and build limits are far beyond this project's expected footprint.^12

No Airtable token should be present in source, browser JavaScript, build output, or repository history.

## Migration and release plan

### Phase 0 — Security and ownership

- Regenerate or delete the exposed Airtable personal access token.

- Decide who owns the text, translations, and three existing pictures.

- Select code and content licenses.

- Add a short disclaimer that entries are editorial recommendations rather than an official standard.

### Phase 1 — Reproducible data migration

- Export all Airtable records once with a local script that reads the token from an environment variable.

- Preserve Airtable record IDs only in private migration metadata or a mapping file, not as public URLs.

- Create stable concept IDs and slugs.

- Split comma- and slash-separated terms into typed arrays.

- Convert parenthetical text into usage notes or definitions where appropriate.

- Resolve the three self-links and review duplicate labels concept by concept.

- Download approved attachments before their URLs expire, then record rights metadata.

### Phase 2 — Credible minimum content

- Review every preferred English and Bokmål label.

- Add short definitions first for ambiguous and high-traffic terms.

- Apply the new domain taxonomy.

- Add at least one source to every reviewed entry.

- Mark remaining entries provisional rather than delaying the entire release.

### Phase 3 — Static product

- Scaffold Astro with exact dependency versions.

- Build the progressive-enhancement index and concept pages.

- Implement system/light/dark themes with CSS custom properties.

- Add JSON and CSV exports, structured metadata, and correction links.

- Deploy preview builds from pull requests and production from `main`.

### Phase 4 — Verification and launch

- Test keyboard, screen-reader labels, 200% zoom, reduced motion, and both colour themes.

- Test representative widths from 320 pixels through desktop.

- Run automated schema checks, link checks, HTML validation, linting, formatting, unit tests, and a production build.

- Verify that no secret or Airtable attachment URL appears in source or output.

- Configure a custom domain only after the GitHub Pages version is stable.

- Contact Termportalen about contribution or federation after the schema and licensing are clear.^4

## Scope for the first public release

Ship the following:

- 147 migrated concepts with reviewed preferred labels or an explicit provisional badge.

- Instant English/Bokmål search and domain filters.

- Stable detail pages and related-term links.

- Responsive light and dark themes.

- Definitions and citations for the most ambiguous or visited concepts.

- One rights-cleared overview diagram.

- JSON and CSV downloads.

- A correction workflow through GitHub Issues.

- Clear code, content, and image licensing.

Defer the following until usage proves the need:

- A runtime database or headless CMS.

- User accounts, voting, comments, or direct editing.

- A server-backed search service.

- Automatic AI-written definitions or translations.

- A picture for every record.

- Full Nynorsk coverage.

- Progressive Web App packaging.

## Success criteria

The release is ready when a visitor can find an English or Norwegian term in one interaction, understand which cycling concept it denotes, follow at least one source for important claims, and share a permanent URL.

Technical targets should include a usable no-JavaScript index, no runtime third-party data request, no cumulative layout shift from images, WCAG 2.2 AA colour contrast, and comfortable operation on a 320-pixel-wide viewport.

Content targets should include zero unresolved self-relations, zero ambiguous comma-delimited status lists, explicit review state on every concept, and rights metadata for every published image.

The strongest long-term signal will be external reuse and corrections, not raw page-view volume.

A downloadable, licensed dataset and a possible Termportalen relationship make that reuse much more likely than an Airtable-backed website alone.

## Decision

Build Trancycle with Astro, store one concept per Markdown file in Git, publish on GitHub Pages, and start with a custom in-page search.

Migrate away from Airtable as the source of truth after a checked export, while keeping it only as a temporary backup during editorial verification.

Invest first in concept structure, definitions, provenance, and a small number of excellent diagrams.

This approach delivers the requested speed, light/dark support, mobile quality, and public usefulness while keeping the system small enough for one person to maintain.

## Sources

1. Trancycle, Airtable base supplied for this assessment, read-only API inventory, accessed 13 September 2026.

2. Digitaliseringsdirektoratet and Språkrådet, “[Termlosen](https://data.norge.no/specification/termlosen),” current web edition, especially sections 6.2–6.4.

3. Språkrådet, “[Hva kan en termliste inneholde?](https://sprakradet.no/aktuelt/hva-kan-en-termliste-inneholde/),” accessed 13 September 2026.

4. University of Bergen, “[Om Termportalen](https://termportalen.w.uib.no/om-termportalen/),” accessed 13 September 2026.

5. Astro, “[Content collections](https://docs.astro.build/en/guides/content-collections/),” accessed 13 September 2026.

6. Astro, “[Islands architecture](https://docs.astro.build/en/concepts/islands/),” accessed 13 September 2026.

7. Astro, “[Images](https://docs.astro.build/en/guides/images/),” accessed 13 September 2026.

8. Hugo, “[Data sources](https://gohugo.io/content-management/data-sources/),” accessed 13 September 2026.

9. Hugo, “[Image processing](https://gohugo.io/content-management/image-processing/)” and “[Multilingual mode](https://gohugo.io/content-management/multilingual/),” accessed 13 September 2026.

10. Eleventy, “[Global Data Files](https://www.11ty.dev/docs/data-global/)” and “[Collections](https://www.11ty.dev/docs/collections/),” accessed 13 September 2026.

11. Jekyll, “[Data Files](https://jekyllrb.com/docs/datafiles/)” and “[Collections](https://jekyllrb.com/docs/collections/),” accessed 13 September 2026.

12. GitHub, “[Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site),” “[Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages),” and “[GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits),” accessed 13 September 2026.

13. Airtable, “[Managing API call limits in Airtable](https://support.airtable.com/articles/7735693959-managing-api-call-limits-in-airtable),” updated August 2026.

14. Airtable, “[Airtable attachment URL behavior](https://support.airtable.com/articles/9671148410-airtable-attachment-url-behavior),” updated August 2026.

15. Airtable, “[Creating personal access tokens](https://support.airtable.com/articles/9934989703-creating-personal-access-tokens),” updated August 2026.

16. Sheldon Brown, “[Sheldon Brown's Bicycle Glossary](https://sheldonbrown.com/glossary.html),” accessed 13 September 2026.

17. Bicycles Stack Exchange, “[Terminology index — a list of bike part names and cycling concepts](https://bicycles.stackexchange.com/questions/244/terminology-index-a-list-of-bike-part-names-and-cycling-concepts),” accessed 13 September 2026.

18. Park Tool, “[Repair Help Articles](https://www.parktool.com/blog/repair-help),” accessed 13 September 2026.

19. Ulrigo, “[Bicycle diagram-no.svg](https://commons.wikimedia.org/wiki/File:Bicycle_diagram-no.svg),” Wikimedia Commons, 28 September 2020, CC BY-SA 4.0.

20. Oslo municipality and Syklistenes Landsforening, “[Sykkelskolen](https://www.oslo.kommune.no/get-file/1124809/d38bc6a2c7242bcdc2f512633f1c6641d37b1d2cacdbb1f10e47c433e264cd6a/),” multilingual cycling word list, accessed 13 September 2026.

21. Pagefind, “[Getting Started with Pagefind](https://pagefind.app/docs/)” and “[Multilingual search](https://pagefind.app/docs/multilingual/),” accessed 13 September 2026.

22. Schema.org, “[DefinedTermSet](https://schema.org/DefinedTermSet),” accessed 13 September 2026.

23. MDN Web Docs, “[prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme)” and “[color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme),” accessed 13 September 2026.

24. W3C Web Accessibility Initiative, “[Understanding Success Criterion 2.5.8: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)” and “[Understanding Success Criterion 2.5.5: Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced),” WCAG 2.2.

25. W3C, “[Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/),” Success Criterion 1.4.3.

26. Creative Commons, “[Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)” and “[Frequently Asked Questions](https://creativecommons.org/faq/),” accessed 13 September 2026.

27. Creative Commons, “[Considerations for licensors and licensees](https://creativecommons.org/share-your-work/licensing-considerations/version4/),” accessed 13 September 2026.
