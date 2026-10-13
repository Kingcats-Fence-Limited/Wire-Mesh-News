import type { Standard } from "./types";

export const slugify = (no: string) => no.toLowerCase().replace(/[\s/]+/g, "-").replace(/[^a-z0-9-]/g, "");

const S = (s: Omit<Standard, "slug">): Standard => ({ ...s, slug: slugify(s.no) });

export const STANDARDS: Standard[] = [
  S({
    no: "EN 10223-4",
    title: "Steel wire and wire products for fencing and netting — Part 4: Steel wire welded mesh fencing",
    body: "cen",
    subject: "fencing",
    status: "under_review",
    edition: "2012",
    checked: "2026-10-12",
    sourceUrl: "https://standards.cencenelec.eu/",
    adoptedAs: ["BS EN 10223-4", "DIN EN 10223-4"],
    covers: "Sets out the requirements for welded steel wire mesh used in fencing: wire tolerances, mesh geometry, weld shear strength, coating classes by reference to the coating standards, and the information a supplier must declare. It does not specify posts, fixings or installation.",
    whyItMatters: ["It is the clause most European tenders cite for welded panels, usually without choosing the class within it.", "The most common misreading is treating ‘complies with EN 10223-4’ as a coating guarantee; coating is by reference to EN 10244-2.", "At acceptance, ask for weld shear results and coating weight with the measurement location stated."],
    related: ["EN 10244-2", "EN 10218-1", "ASTM A185"],
    equivalents: [{ body: "BSI", no: "BS EN 10223-4", relation: "equivalent" }, { body: "DIN", no: "DIN EN 10223-4", relation: "equivalent" }, { body: "ASTM", no: "ASTM A185 / A1064", relation: "partial" }, { body: "SAC", no: "GB/T 33281", relation: "partial" }],
    changelog: [
      { date: "2026-10-12", kind: "status", text: "CEN opened a systematic review of this part. No technical change has been published yet.", source: "https://standards.cencenelec.eu/" },
      { date: "2026-09-16", kind: "status", text: "Status wording corrected from ‘under revision’ to ‘under systematic review’ following a reader letter." },
      { date: "2026-08-02", kind: "equivalents", text: "National adoptions BS EN 10223-4 and DIN EN 10223-4 linked in the equivalence table.", source: "https://www.bsigroup.com/" },
      { date: "2026-06-15", kind: "added", text: "First summary published. Edition 2012 recorded as current." },
    ],
    followers: 128,
    certifiedCompanies: ["hengtai-mesh", "northline-fencing"],
  }),
  S({
    no: "EN 10244-2",
    title: "Steel wire and wire products — Non-ferrous metallic coatings on steel wire — Part 2: Zinc or zinc alloy coatings",
    body: "cen",
    subject: "materials_services",
    status: "current",
    edition: "2009",
    checked: "2026-10-05",
    sourceUrl: "https://standards.cencenelec.eu/",
    adoptedAs: ["BS EN 10244-2", "DIN EN 10244-2"],
    covers: "Defines the classes of zinc and zinc-alloy coatings on steel wire by minimum coating mass per square metre, together with the test methods for mass, adherence and uniformity. It is the standard most fencing specifications mean when they write ‘galvanised’.",
    whyItMatters: ["Class, not the word ‘galvanised’, is what a supplier can be held to.", "Coating mass is measured on wire; what arrives on site as finished panel may read lower at contact points.", "Specify the class, the measurement location and the sampling plan together."],
    related: ["EN 10223-4", "EN ISO 1461", "ASTM A641"],
    equivalents: [{ body: "ASTM", no: "ASTM A641 / A856", relation: "partial" }, { body: "ISO", no: "ISO 7989-2", relation: "equivalent" }],
    changelog: [{ date: "2026-06-15", kind: "added", text: "First summary published. Edition 2009 recorded as current." }],
    followers: 94,
    certifiedCompanies: ["hengtai-mesh"],
  }),
  S({ no: "ASTM A392", title: "Standard Specification for Zinc-Coated Steel Chain-Link Fence Fabric", body: "astm", subject: "fencing", status: "current", edition: "2019", checked: "2026-10-05", sourceUrl: "https://www.astm.org/", covers: "Covers zinc-coated steel chain-link fabric: wire sizes, mesh sizes, coating classes by mass and the selvage types. It is the usual North American reference for chain link.", whyItMatters: ["Coating is specified by class in oz/ft²; convert before comparing with European certificates.", "Mesh size tolerance is wider than many buyers assume."], related: ["ASTM A491", "EN 10244-2"], changelog: [{ date: "2026-06-20", kind: "added", text: "First summary published." }], followers: 61 }),
  S({ no: "ASTM A185", title: "Standard Specification for Steel Welded Wire Reinforcement, Plain, for Concrete", body: "astm", subject: "reinforcement", status: "withdrawn", edition: "2007", checked: "2026-09-30", sourceUrl: "https://www.astm.org/", replacedBy: "ASTM A1064", covers: "Historic specification for plain welded wire reinforcement in concrete. Withdrawn and replaced by ASTM A1064, which combines plain and deformed wire.", whyItMatters: ["Older drawings still cite it; treat references as pointing to A1064.", "Not a fencing standard despite frequent misuse in tenders."], related: ["ASTM A1064"], changelog: [{ date: "2026-06-20", kind: "withdrawn", text: "Recorded as withdrawn; replaced by ASTM A1064." }], followers: 12 }),
  S({ no: "ASTM A1064", title: "Standard Specification for Carbon-Steel Wire and Welded Wire Reinforcement, Plain and Deformed, for Concrete", body: "astm", subject: "reinforcement", status: "current", edition: "2022", checked: "2026-09-30", sourceUrl: "https://www.astm.org/", replaces: "ASTM A185", covers: "Current specification for welded wire reinforcement in concrete, plain and deformed.", whyItMatters: ["The reference to use where older documents cite A185 or A497."], related: ["ASTM A185"], changelog: [{ date: "2026-06-20", kind: "added", text: "First summary published." }], followers: 33 }),
  S({ no: "EN ISO 1461", title: "Hot dip galvanized coatings on fabricated iron and steel articles — Specifications and test methods", body: "cen", subject: "materials_services", status: "current", edition: "2022", checked: "2026-10-01", sourceUrl: "https://www.iso.org/", adoptedAs: ["BS EN ISO 1461", "DIN EN ISO 1461"], covers: "Coating thickness requirements and test methods for hot-dip galvanized fabricated articles — posts, gates and frames rather than wire.", whyItMatters: ["Applies to posts and gates; wire and mesh fall under EN 10244-2.", "Thickness varies with steel thickness; the table matters."], related: ["EN 10244-2", "ISO 9223"], changelog: [{ date: "2026-06-22", kind: "added", text: "First summary published." }], followers: 70 }),
  S({ no: "ISO 9223", title: "Corrosion of metals and alloys — Corrosivity of atmospheres — Classification, determination and estimation", body: "iso", subject: "materials_services", status: "current", edition: "2012", checked: "2026-10-01", sourceUrl: "https://www.iso.org/", covers: "Classifies atmospheric corrosivity into categories C1 to CX and gives the basis for estimating coating life from the category.", whyItMatters: ["The link between site environment and the coating class you should specify.", "Coastal and industrial sites often sit two categories above what the specifier assumed."], related: ["EN ISO 1461", "EN 10244-2"], changelog: [{ date: "2026-06-22", kind: "added", text: "First summary published." }], followers: 45 }),
  S({ no: "EN 10218-1", title: "Steel wire and wire products — General — Part 1: Test methods", body: "cen", subject: "materials_services", status: "current", edition: "2012", checked: "2026-09-20", sourceUrl: "https://standards.cencenelec.eu/", covers: "Test methods for steel wire: tensile, torsion, wrapping and coating tests referenced by the product standards.", whyItMatters: ["When a certificate quotes a test, this is usually the method behind it."], related: ["EN 10223-4", "EN 10244-2"], changelog: [{ date: "2026-06-25", kind: "added", text: "First summary published." }], followers: 18 }),
  S({ no: "EN 10204", title: "Metallic products — Types of inspection documents", body: "cen", subject: "materials_services", status: "current", edition: "2004", checked: "2026-09-20", sourceUrl: "https://standards.cencenelec.eu/", covers: "Defines the types of inspection document (2.1, 2.2, 3.1, 3.2) and who signs each. The standard behind the phrase ‘mill certificate’.", whyItMatters: ["A 2.2 declares; a 3.1 reports specific tests. Ask for the type you need.", "A 3.2 adds an independent witness and costs accordingly."], related: ["EN 10223-4"], changelog: [{ date: "2026-06-25", kind: "added", text: "First summary published." }], followers: 52 }),
  S({ no: "ISO 9044", title: "Industrial woven wire cloth — Technical requirements and tests", body: "iso", subject: "filtration", status: "current", edition: "2016", checked: "2026-09-15", sourceUrl: "https://www.iso.org/", covers: "Requirements and test methods for industrial woven wire cloth: aperture, wire diameter, weave types and tolerances.", whyItMatters: ["The basis for comparing filtration cloth from different mills."], related: ["ISO 4783-1"], changelog: [{ date: "2026-07-01", kind: "added", text: "First summary published." }], followers: 27, certifiedCompanies: ["silvermesh-filtration"] }),
  S({ no: "DIN 24537-1", title: "Gratings as floor coverings — Part 1: Metal gratings", body: "din", subject: "access", status: "current", edition: "2006", checked: "2026-09-15", sourceUrl: "https://www.din.de/", covers: "Requirements for metal gratings used as floor coverings: load classes, deflection limits and designation.", whyItMatters: ["The source of most European grating load tables.", "Check which deflection limit the table assumed."], related: ["RAL-GZ 638"], changelog: [{ date: "2026-07-01", kind: "added", text: "First summary published." }], followers: 22, certifiedCompanies: ["gridtech-grating"] }),
  S({ no: "ASTM A975", title: "Standard Specification for Double-Twisted Hexagonal Mesh Gabions and Revet Mattresses", body: "astm", subject: "reinforcement", status: "current", edition: "2021", checked: "2026-09-10", sourceUrl: "https://www.astm.org/", covers: "Requirements for double-twisted hexagonal mesh gabions and mattresses: wire, coatings including PVC, mesh and assembly.", whyItMatters: ["The reference for PVC-coated gabion wire in coastal work."], related: ["EN 10223-3"], changelog: [{ date: "2026-07-05", kind: "added", text: "First summary published." }], followers: 19, certifiedCompanies: ["terraweave-gabions"] }),
  S({ no: "EN 10223-3", title: "Steel wire and wire products for fencing and netting — Part 3: Hexagonal steel wire mesh products for civil engineering purposes", body: "cen", subject: "reinforcement", status: "current", edition: "2013", checked: "2026-09-10", sourceUrl: "https://standards.cencenelec.eu/", covers: "Hexagonal double-twist mesh for civil engineering: wire, coatings, mesh geometry and mechanical requirements.", whyItMatters: ["European counterpart to ASTM A975."], related: ["ASTM A975"], equivalents: [{ body: "ASTM", no: "ASTM A975", relation: "partial" }], changelog: [{ date: "2026-07-05", kind: "added", text: "First summary published." }], followers: 15 }),
  S({ no: "prEN 10223-7", title: "Steel wire and wire products for fencing and netting — Part 7: Welded panels (draft)", body: "cen", subject: "fencing", status: "draft", checked: "2026-10-02", sourceUrl: "https://standards.cencenelec.eu/", covers: "Draft part addressing welded panel systems as assembled products. Public enquiry stage; content may change.", whyItMatters: ["Do not specify against a draft; monitor for publication."], related: ["EN 10223-4"], changelog: [{ date: "2026-10-02", kind: "added", text: "Draft recorded at enquiry stage." }], followers: 40 }),
];

export const getStandard = (slug: string) => STANDARDS.find((s) => s.slug === slug);
export const getStandardByNo = (no: string) => STANDARDS.find((s) => s.no === no);
export const standardsBySubject = (subject: string) => STANDARDS.filter((s) => s.subject === subject);
export const recentStandardChanges = (n = 3) =>
  STANDARDS.flatMap((s) => s.changelog.map((c) => ({ ...c, no: s.no, slug: s.slug, status: s.status })))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, n);
