# Airtable migration report

The migration was completed on 13 September 2026 from the 147 records in the original Airtable table.

Each Airtable row became one concept file with a stable semantic ID and slug.

English and Bokmål alternatives separated by commas or slashes became individual term variants, while punctuation inside parentheses was preserved.

Leading and trailing parenthetical explanations became language-specific notes where they could be separated safely.

The duplicate labels `drop`, `manual`, and `reach` received meaning-specific slugs based on their Bokmål terms.

Three Airtable self-relations were discarded, and the remaining related-record links were converted to concept IDs.

The three Airtable attachments were excluded because their URLs expire and their publication rights still need review.

The non-cycling Bokmål alternative `høretelefoner` was removed from the `head set` concept and retained only in a disambiguation note.

The compact Airtable phrase `å sykle/dra på bakhjulet` was expanded to the complete alternatives `å sykle på bakhjulet` and `å dra på bakhjulet`.

A file-by-file audit compared all 147 canonical concepts with the preserved Airtable import staging files.

No other multi-variant field used the same shared-suffix pattern, and no other migrated label differed from the staging import beyond the documented `head set` cleanup and `wheelie` expansion.

All migrated concepts are marked `provisional` because the Airtable table did not provide reviewed definitions, citations, reviewers, or review dates.

The next content pass should review preferred-term ordering, replace descriptive translations with proper terms where possible, refine the three broad legacy domains, and add original definitions with sources.
