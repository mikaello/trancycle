import { getCollection } from "astro:content";
import { byPreferredTerm, preferredTerm } from "../../lib/terms";

export const prerender = true;

const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;

export async function GET() {
  const entries = (await getCollection("terms")).sort(byPreferredTerm("en"));
  const rows = [
    [
      "id",
      "slug",
      "english",
      "norwegian_bokmal",
      "domains",
      "editorial_status",
      "license",
      "attribution",
    ],
    ...entries.map((entry) => [
      entry.data.id,
      entry.data.slug,
      preferredTerm(entry, "en"),
      preferredTerm(entry, "nb"),
      entry.data.domains.join(" | "),
      entry.data.review.status,
      "https://creativecommons.org/licenses/by/4.0/",
      "Trancycle contributors — https://github.com/mikaello/trancycle",
    ]),
  ];
  const csv = `${rows.map((row) => row.map(quote).join(",")).join("\n")}\n`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      Link: '<https://creativecommons.org/licenses/by/4.0/>; rel="license"',
    },
  });
}
