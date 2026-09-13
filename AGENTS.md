# Trancycle agent instructions

## Mission

Trancycle is an open cycling terminology project that connects language-specific terms to clearly defined cycling concepts.

The initial public experience focuses on English and Norwegian Bokmål, while the data model must remain open to Nynorsk and other languages.

Read `PUBLIC-RELEASE-RESEARCH.md` before making architectural or content-model changes.

## Core terminology model

A concept is one distinct meaning or thing in the cycling domain.

A term is a language-specific label for a concept.

Keep homonyms as separate concepts when their meanings differ, such as `manual` the riding technique and `manual` the instruction book.

Keep translations, spelling variants, synonyms, definitions, relations, references, and images for the same meaning together in one concept record.

Do not merge concepts solely because an English or Norwegian label is identical.

Use BCP 47 language keys such as `en`, `nb`, and `nn`.

Do not hard-code the content model to exactly two languages.

## Architecture direction

Use Astro to generate a static site unless the task explicitly changes the accepted architecture.

Treat Git concept files as the canonical data source after the Airtable migration.

Do not add Airtable or another database as a visitor-facing runtime dependency.

Keep the full unfiltered glossary available in static HTML and add search as progressive enhancement.

Generate machine-readable JSON and CSV exports from the canonical concept files.

Use stable concept IDs and permanent slugs.

## Contributions

Keep contribution paths friendly to people who do not know Git, Markdown, YAML, or the internal schema.

Use GitHub issue forms as the simplest path for proposing a new concept, translation, or correction.

Link each concept page to a prefilled contribution form containing its stable ID when the site is implemented.

Allow experienced contributors to edit concept files through pull requests.

Convert accepted issue suggestions into concept-file changes with a reviewable pull request.

Require enough context to distinguish the intended cycling meaning.

Prefer a supporting source, but allow useful unsourced suggestions to enter as provisional rather than silently treating them as reviewed.

Never present AI-generated terminology or definitions as reviewed evidence.

## Content quality

Write original definitions and cite the sources used to verify terminology or technical claims.

Separate preferred, admitted, colloquial, regional, and deprecated terms instead of combining them in a comma-delimited string.

Use typed broader, narrower, and related concept links.

Do not create self-relations or relations to missing concept IDs.

Give every concept an explicit editorial state and give reviewed concepts a review date and source.

Describe Trancycle as community-maintained rather than an official terminology standard unless formal backing is established.

Treat integration with Termportalen as future work after the schema, licensing, and review process are stable.

## Images and licensing

Store published images locally or in an intentional stable asset host, never through expiring Airtable attachment URLs.

Every image must record alt text, creator, original source URL, and license.

Do not copy third-party definitions, photographs, or diagrams without compatible rights and attribution.

Keep code, original glossary content, and third-party media licensing clearly separated.

## Security

Never commit, print, or expose Airtable credentials or other secrets.

Read secrets only from environment variables in one-time migration tooling.

Verify that no credential or expiring Airtable attachment URL appears in source, history, or generated output.

## Git and quality

Start new tasks from the latest `main` on a fresh hyphenated branch.

Use conventional commits such as `feat:`, `fix:`, `docs:`, or `chore:`.

Use the `gh` CLI for GitHub issues and pull requests.

Prefer a pull request over pushing directly to `main`.

Keep changes tightly scoped and do not implement adjacent improvements without a request.

Install npm packages with `--save-exact`.

Run relevant tests, linting, formatting, schema validation, link checks, and a production build before pushing.

Fix failures before considering a task complete.

Write one sentence per line in Markdown files.
