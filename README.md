# Trancycle

Trancycle is an open English–Norwegian glossary of cycling terms.

The public site is a static Astro build with local search, light and dark themes, permanent concept pages, and JSON and CSV exports.

Git concept files are the canonical data source, and Cloudflare Pages is the intended production host.

Read the [public release research](./PUBLIC-RELEASE-RESEARCH.md) for the architecture decision and [ROADMAP.md](./ROADMAP.md) for the next phases.

## Local development

Use Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Run the full local quality gate before opening a pull request.

```sh
npm run format:check
npm run check
npm test
npm run build
```

## Content

Each file in `src/content/terms/` represents one cycling concept and contains its terms in each language.

The schema is validated during `npm run check` and the production build.

Machine-readable exports are generated at `/data/terms.json` and `/data/terms.csv`.

## Airtable migration

The import command reads the credential only from the `AIRTABLE_TOKEN` environment variable and writes to the ignored `migration/airtable-import/` staging directory by default.

```sh
AIRTABLE_TOKEN=... npm run import:airtable
```

Review the staged files before moving them into `src/content/terms/` because comma-separated alternatives, duplicate labels, taxonomy, and relations need editorial judgment.

Airtable attachment URLs are deliberately excluded from the import.

## Cloudflare Pages

Connect the GitHub repository to a Cloudflare Pages project and use the Astro preset.

Set the build command to `npm run build` and the output directory to `dist`.

No server adapter, database, runtime API, or visitor-facing secret is required.

## Contributing

You do not need to know Git or the internal data format to contribute.

- [Suggest a new cycling term](https://github.com/mikaello/trancycle/issues/new?template=new-term.yml)

- [Suggest a translation](https://github.com/mikaello/trancycle/issues/new?template=translation.yml)

- [Report a correction](https://github.com/mikaello/trancycle/issues/new?template=correction.yml)

Pull requests are also welcome.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the contribution and review principles.
