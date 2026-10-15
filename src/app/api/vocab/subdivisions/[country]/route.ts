/* Top-level ISO 3166-2 subdivisions for one country, from the controlled vocabulary.
   Static per country so the 450 KB table never ships to the browser in full. */
import { NextResponse } from "next/server";
import { COUNTRY } from "@/data/vocab/country";
import { subdivisionsOf } from "@/lib/vocab-geo";

export const dynamic = "force-static";
/* Only the prebuilt country codes exist; anything else is a 404 rather than a new cached page. */
export const dynamicParams = false;

export function generateStaticParams() {
  return COUNTRY.map((c) => ({ country: c.alpha2 }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  return NextResponse.json(subdivisionsOf(country.toUpperCase()));
}
