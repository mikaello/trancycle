# Bicycle diagram: research and implementation

Research date: 13 September 2026.

## Decision

Build a visual glossary with an uncluttered overview and four focused diagrams: frame, drivetrain, headset, and wheel/brake.
The five drawings annotate 35 distinct existing concepts, with seven or eight callouts per view.
Put the explorer at `/explore/`, link it immediately below the homepage search, add desktop navigation, and link represented concept pages back to their drawings.
This gives visitors who do not know a part's name a visible entry point while preserving the full static glossary and its search position.

Use original inline SVG artwork with HTML annotation links, a bilingual numbered key, and progressive selection in a small script.
The SVG is the illustration; the HTML links provide native focus, activation, touch targets, and static destinations.
A dedicated static route per view makes each detail independently shareable and usable when JavaScript fails.

## Prior art and what it contributes

| Reference                                                                                                                                                 | Observation                                                                                                                                                                                       | Application to Trancycle                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [Ulrigo's Norwegian bicycle diagram](https://commons.wikimedia.org/wiki/File:Bicycle_diagram-no.svg)                                                      | A side elevation with Norwegian callouts gives an immediate overview; the source is a 312 kB SVG under CC BY-SA 4.0.                                                                              | Keep the recognizable side view and explicit pointers; use canonical bilingual labels outside the artwork and fewer annotations per view. |
| [Park Tool Repair Help](https://www.parktool.com/en-us/blog/repair-help)                                                                                  | Search, categories, and a bicycle map lead to repair subjects; the page explicitly describes the map as a tablet/desktop feature, and its accessible content instructs users to roll over a menu. | Pair the visual map with a text key, but make selection work by activation and keep the same feature available on phones.                 |
| [Shimano technical documents](https://si.shimano.com/en/) and [RD-M732 exploded view](https://si.shimano.com/en/pdfs/ev/RD-M732-0963/EV-RD-M732-0963.pdf) | Exploded drawings and numbered keys identify small components such as guide and tension pulleys, with model-specific assemblies.                                                                  | Give advanced parts dedicated views, and distinguish a general terminology sketch from a model-specific service document.                 |
| [Park Tool headset service](https://www.parktool.com/en-us/blog/repair-help/threadless-headset-service)                                                   | Shows the relationship of the steerer, bearings, stem, spacers, top cap, and crown race.                                                                                                          | Use an exploded headset sketch and a separate cutaway for the star nut; explicitly label the illustrated construction.                    |
| [Park Tool rear derailleur explanation](https://www.parktool.com/en-us/blog/repair-help/how-a-rear-derailleur-works)                                      | Distinguishes the guide pulley, tension pulley, and mechanical cable adjustment.                                                                                                                  | Include those three small parts in a dedicated drivetrain view.                                                                           |

These are references for design and technical orientation, not imported artwork or copied definitions.
The Commons license would permit an attributed adaptation under its ShareAlike terms, but a new drawing gives control over density, construction, visual style, and language placement.
The original artwork and annotation text use CC BY 4.0 under the repository's documented attribution rules.

## Alternatives considered

| Approach                            | Strength                                                                                | Limitation for this project                                                                                      | Decision                                           |
| ----------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| One drawing with 30–50 labels       | Everything appears in one place.                                                        | Labels collide on phones, and hidden internals have no honest visible location.                                  | Use several views.                                 |
| Photo with hotspots                 | Familiar material and component appearance.                                             | Occlusion, model dependence, licensing, and difficult dark-theme integration; zoom does not reveal hidden parts. | Useful future supplements for individual concepts. |
| Raster or AI-generated illustration | Can establish a distinctive aesthetic quickly.                                          | Tiny labels and component geometry need separate verification, and pixels do not provide interaction semantics.  | Draw maintainable code-native geometry instead.    |
| Pan/zoom canvas or 3D model         | Can expose detail and different angles.                                                 | Adds rendering, accessibility, asset, and gesture complexity; competes with page scrolling on touch devices.     | Not justified for this release.                    |
| Inline SVG plus HTML controls       | Crisp scaling, small assets, theme support, static output, and native HTML interaction. | Requires intentional callout placement and separate detailed illustrations.                                      | Implemented.                                       |

The recommendation to use SVG follows from these constraints rather than treating the previous roadmap as a fixed choice.
More advanced parts are useful when their location and distinction can actually be seen.
An eight-part drivetrain or seven-part headset sketch is more useful for that purpose than another cluster of labels over the rear axle or head tube of the whole bicycle.

## Interaction and placement

Desktop uses a drawing and bilingual key side by side, with the selected annotation below the drawing.
Phones stack the drawing, annotation, and complete key.
Markers stay 44 × 44 CSS pixels independently of the SVG scale, and their edge positions keep them separated at a 320-pixel viewport.
Choosing a list entry on a narrow screen reveals and focuses its inspection panel.
Choosing a marker keeps the focus on that marker, so keyboard users can continue through the drawing.
Selection highlights both the numbered key and the pointer endpoint, updates a polite status message, and writes a stable `#part-CONCEPT-ID` fragment.
Browser Back/Forward and incoming fragments restore the selected part.

The [WCAG target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) explains the 24 CSS pixel minimum and equivalent-control exception for dense visualizations.
We choose larger 44-pixel controls and a full text key instead of relying on that exception.
Nothing depends on hover, a tooltip, dragging, a precision gesture, or a modal.
The implementation introduces no animated view transitions and inherits the site's reduced-motion behavior.

Without JavaScript, every inspection section is visible and each numbered marker or key link jumps to its section, which links directly to the permanent concept page.
All five view links remain ordinary navigation links.
The diagram artwork and script only load on explorer pages; the homepage adds a lightweight text invitation.

## Content and scope

Labels, alternatives, concept URLs, and editorial states come from the canonical concept files at build time.
The diagram manifest adds stable IDs, drawing coordinates, short location hints, accessible descriptions, and reference links; it does not create a second glossary.
The language-keyed concept model is unchanged.
No term is promoted to reviewed status by appearing in a drawing.
The visible provenance disclosure identifies the SVG as AI-assisted work awaiting an anatomy review.

The overview depicts a rigid-fork, flat-bar bicycle with a single front chainring and disc brakes.
The frame view shows an open rear dropout; the drivetrain depicts a mechanical derailleur; the headset depicts a threadless system with a star nut; the wheel view is explicitly from the brake side.
The sketches are simplified and are not dimensioned, model-specific assembly or repair instructions.
Keep manufacturer variations, suspension, geometry, wheel internals, and other bicycle types for subsequent focused views after feedback.

## Validation and remaining review

Automated checks cover canonical IDs, duplicate annotations, coordinate bounds, non-overlapping 44-pixel markers at the smallest layout, generated local links and fragments, visible static text alternatives, and compressed size budgets.
CI builds the site before running `npm run test:site`, so missing concept or diagram destinations fail the build pipeline.
The size check includes both inline and external scripts because Astro can inline small modules.
The production build contains 154 HTML pages with valid local links and fragments; the largest compressed diagram is 7,945 bytes and the combined scripts on an explorer page are 885 bytes.

Browser checks cover desktop and narrow mobile layouts, light/dark themes, keyboard activation, pointer activation, list-to-panel focus, history restoration, and concept-to-diagram fragments.
A separate local server with `Content-Security-Policy: script-src 'none'` is used to check the real static fallback with scripts blocked.
The full glossary remains searchable and contains all 147 concepts.

Engineering checks are not a user study, physical-device test, full assistive-technology audit, or expert anatomy sign-off.
Before marking the feature reviewed, test the following with novice riders and experienced mechanics on their own phones and desktops:

1. Identify an unfamiliar visible part without knowing its name.
2. Find a part from its English or Norwegian label and open the corresponding concept.
3. Distinguish the guide pulley from the tension pulley.
4. Distinguish the frame's head tube from the fork's steerer tube.
5. Return from a concept page to its illustrated location.

Record wrong selections, uncertainty about callout endpoints, need for zoom, and whether the list or illustration was used first.
Use those findings to adjust density or add a focused view rather than expanding the overview indiscriminately.
