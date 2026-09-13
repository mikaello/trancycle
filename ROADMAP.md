# Trancycle roadmap

## Phase 1: fast public glossary

The first release is a static English–Bokmål glossary with instant local search, permanent concept pages, visible editorial status, and downloadable JSON and CSV data.

The remaining launch work is to migrate and normalize all Airtable records, review ambiguous translations, add original definitions and sources, select licenses, and connect Cloudflare Workers Builds.

## Phase 2: interactive bicycle map

An interactive bicycle diagram should be the signature next feature, but it should begin as a content and interaction design project rather than a decorative illustration.

The diagram should help someone move from a visible bicycle part to the correct concept, translation, definition, and related components.

The first version should use an original or rights-cleared inline SVG with stable elements keyed to concept IDs.

It should work as useful static artwork before JavaScript loads and progressively add pointer, touch, and keyboard interactions.

Every hotspot must have an accessible text equivalent, a large touch target, a visible focus state, and a direct link to its concept page.

The feature should avoid a canvas renderer, a general visualization framework, web fonts, and runtime data fetching.

The initial performance budget should keep the optimized SVG below 150 kB compressed and its interaction script below 10 kB compressed.

The first map should cover a carefully reviewed set of roughly 30 visually identifiable parts on one conventional bicycle.

Geometry, drivetrain, wheel anatomy, suspension, and bicycle-type variants can follow as separate focused layers instead of overcrowding one drawing.

Before implementation, test a desktop labeled view and a mobile tap-to-inspect view with real users who arrive with either an English word, a Norwegian word, or no word at all.

Success means that the diagram makes an unknown part easier to identify without delaying the glossary's first render or making search harder to reach.

## Phase 3: terminology network

Add Nynorsk and other languages to existing concepts through BCP 47 language keys rather than duplicating pages.

Introduce richer reviewed definitions, usage notes, typed relations, and licensed images where they materially improve identification.

Investigate Pagefind only when the local index is no longer comfortably small.

Explore publication through Termportalen after the schema, licensing, provenance, and editorial review process are stable.
