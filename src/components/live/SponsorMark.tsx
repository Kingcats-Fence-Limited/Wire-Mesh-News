"use client";

/* "★ SPONSOR <year>" ribbon for Directory Sponsors (yearly). A label only — sponsors keep the
   same place in every list. */
import { useSponsorYears } from "@/lib/paid-members";

export function SponsorRibbon({ year, small }: { year: number; small?: boolean }) {
  return (
    <span className="spmark" data-small={small ? "" : undefined} title="This company sponsors Wire Mesh News for the year shown. Sponsorship does not change its place in the Directory or our coverage.">
      <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" /></svg>
      SPONSOR {year}
    </span>
  );
}

/** Mark next to a company name on its profile. */
export function SponsorMark({ slug }: { slug: string }) {
  const years = useSponsorYears();
  const y = years.get(slug);
  return y ? <SponsorRibbon year={y} /> : null;
}
