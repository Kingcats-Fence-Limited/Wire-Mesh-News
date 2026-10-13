/* Controlled facets on articles, in the Directory's own codes. Each resolves to a label
   and to the page where that facet is browsable, which is what closes the loop between
   an article, the Directory filters and the application pages. */
import { PRODUCT_BY_CODE } from "@/data/vocab/product";
import { APPLICATION_AREA_BY_CODE } from "@/data/vocab/application_area";
import { MATERIAL_GROUP_BY_CODE } from "@/data/vocab/material_group";
import { REGION_BY_CODE } from "@/data/vocab/region";
import { PROCESS_BY_CODE } from "@/data/vocab/process";
import { SURFACE_TREATMENT_BY_CODE } from "@/data/vocab/surface_treatment";

export type Facet = { key: string; kind: string; label: string; href: string; title: string };

export function facet(key: string): Facet | null {
  const [kind, code] = key.split(":");
  const q = (label: string) => `/search/?q=${encodeURIComponent(label)}`;
  switch (kind) {
    case "product": { const x = PRODUCT_BY_CODE[code]; return x ? { key, kind: "Product", label: x.labelEn, href: `/directory/?product=${code}`, title: `Companies that make ${x.labelEn}` } : null; }
    case "application": { const x = APPLICATION_AREA_BY_CODE[code]; return x ? { key, kind: "Application", label: x.labelEn, href: `/applications/${code.replace(/_/g, "-")}/`, title: `${x.labelEn} articles` } : null; }
    case "material": { const x = MATERIAL_GROUP_BY_CODE[code]; return x ? { key, kind: "Material", label: x.labelEn, href: `/directory/?material=${code}`, title: `Companies working in ${x.labelEn}` } : null; }
    case "region": { const x = REGION_BY_CODE[code]; return x ? { key, kind: "Region", label: x.labelEn, href: `/directory/?region=${code}`, title: `Companies in ${x.labelEn}` } : null; }
    case "process": { const x = PROCESS_BY_CODE[code]; return x ? { key, kind: "Process", label: x.labelEn, href: q(x.labelEn), title: `Search: ${x.labelEn}` } : null; }
    case "surface": { const x = SURFACE_TREATMENT_BY_CODE[code]; return x ? { key, kind: "Coating", label: x.labelEn, href: q(x.labelEn), title: `Search: ${x.labelEn}` } : null; }
    default: return null;
  }
}
export const facetsOf = (keys: string[] = []) => keys.map(facet).filter((f): f is Facet => !!f);
