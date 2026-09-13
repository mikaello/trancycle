import { getCollection } from "astro:content";
import { byPreferredTerm } from "../../lib/terms";

export const prerender = true;

export async function GET() {
  const entries = (await getCollection("terms")).sort(byPreferredTerm("en"));
  const payload = entries.map(({ data }) => ({
    ...data,
    review: {
      ...data.review,
      last_reviewed: data.review.last_reviewed?.toISOString().slice(0, 10),
    },
  }));

  return new Response(`${JSON.stringify(payload, null, 2)}\n`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
