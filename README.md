# Trancycle

Trancycle is an open English–Norwegian glossary of cycling terms.

The public site is a static Astro build with local search, light and dark themes, permanent concept pages, and JSON and CSV exports.

Git concept files are the canonical data source, and Cloudflare Workers Static Assets is the intended production host.

Read the [public release research](./docs/PUBLIC-RELEASE-RESEARCH.md) for the architecture decision and [ROADMAP.md](./docs/ROADMAP.md) for the next phases.

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

The 147 Airtable records were migrated on 13 September 2026.

Git concept files are now canonical, and every migrated entry remains provisional until its terminology and meaning have been reviewed.

The retained import command reads the credential only from the `AIRTABLE_TOKEN` environment variable and writes to the ignored `migration/airtable-import/` staging directory by default.

```sh
AIRTABLE_TOKEN=... npm run import:airtable
```

Review the staged files before moving them into `src/content/terms/` because comma-separated alternatives, duplicate labels, taxonomy, and relations need editorial judgment.

Airtable attachment URLs are deliberately excluded from the import.

See [MIGRATION-REPORT.md](./docs/MIGRATION-REPORT.md) for the migration decisions and remaining content work.

## Cloudflare deployment

Connect the GitHub repository to a new Cloudflare Worker through Workers Builds.

Set the build command to `npm run build` and the deploy command to `npm run deploy`.

The checked-in Wrangler configuration publishes the generated `dist` directory as static assets and serves the custom 404 page.

Pull-request previews use public `workers.dev` commit and branch URLs, while the production `workers.dev` route remains disabled.

No Astro server adapter, database, runtime API, or visitor-facing secret is required.

Cloudflare Pages remains compatible, but Cloudflare and Astro now recommend Workers for new projects.

## Contributing

You do not need to know Git or the internal data format to contribute.

- [Suggest a new cycling term](https://github.com/mikaello/trancycle/issues/new?template=new-term.yml)

- [Suggest a translation](https://github.com/mikaello/trancycle/issues/new?template=translation.yml)

- [Report a correction](https://github.com/mikaello/trancycle/issues/new?template=correction.yml)

Pull requests are also welcome.

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for the contribution and review principles.

## License

The original dictionary content and generated data exports are available under CC BY 4.0 and require attribution.

The site code is available under the MIT License.

See [LICENSE](./LICENSE) for attribution and scope details.
