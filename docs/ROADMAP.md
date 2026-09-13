# Trancycle roadmap

## Phase 1: fast public glossary

The first release is a static English–Bokmål glossary with instant local search, permanent concept pages, visible editorial status, and downloadable JSON and CSV data.

The Airtable records have been migrated as provisional concept files.

The remaining launch work is to normalize ambiguous translations, add original definitions and sources, review image rights, verify the Cloudflare production deployment, and attach the final domain.

## Phase 2: interactive bicycle map

The first implementation is available at `/explore/`, with an overview and separate frame, drivetrain, headset, and wheel/brake views.

Read [BICYCLE-DIAGRAM-RESEARCH.md](./BICYCLE-DIAGRAM-RESEARCH.md) for the research, design choices, and validation results.

The original inline SVG artwork uses stable concept IDs and the canonical glossary labels.
Static annotation links and text remain available without JavaScript, with progressive selection, 44-pixel markers, visible keyboard focus, and direct concept links.

The implementation uses no canvas renderer, visualization framework, web fonts, or runtime data fetching.
Generated link checks and the original 150 kB compressed SVG / 10 kB compressed interaction-script budgets run in CI.

Before calling the diagrams reviewed, arrange an editorial anatomy review and test identification tasks with real mobile and desktop users who arrive with an English word, a Norwegian word, or no word at all.
The current implementation has engineering validation, not a completed user study or expert sign-off.

Consider geometry, suspension, wheel internals, and bicycle-type variants after that feedback, as separate focused views instead of extra labels on the overview.

Success means that the diagram makes an unknown part easier to identify without delaying the glossary's first render or making search harder to reach.

## Phase 3: terminology network

Add Nynorsk and other languages to existing concepts through BCP 47 language keys rather than duplicating pages.

Introduce richer reviewed definitions, usage notes, typed relations, and licensed images where they materially improve identification.

Investigate Pagefind only when the local index is no longer comfortably small.

Explore publication through Termportalen after the schema, licensing, provenance, and editorial review process are stable.
