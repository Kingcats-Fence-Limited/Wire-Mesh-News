import type { Company, EventItem } from "./types";

export const COMPANIES: Company[] = [
  {
    slug: "hengtai-mesh",
    name: "Hengtai Mesh",
    legalName: "Hengtai Wire Mesh Products Co., Ltd.",
    orgType: "manufacturer",
    categories: ["fencing", "reinforcement"], applications: ["industrial_security", "architecture"], materials: ["carbon_steel"],
    products: ["welded_mesh_panel", "welded_mesh_roll", "anti_climb_358", "twin_wire_panel", "gabion"],
    processes: ["welding", "galvanizing", "fabrication"],
    country: "CN",
    subdivision: "CN-HE",
    city: "Anping",
    founded: 2004,
    employees: "201_500",
    claimed: true,
    verifiedAt: "2026-09-30",
    summary: "Welded mesh panels and rolls for perimeter, security and civil applications, exported mainly to Europe, the Gulf and Southeast Asia. Operates its own hot-dip galvanizing line.",
    website: "https://example.com",
    exportMarkets: ["europe", "middle_east", "southeast_asia"],
    certifications: [
      { type: "iso_9001", issuer: "TÜV Rheinland", no: "01 100 1234567", expires: "2028-03-14", verified: true },
      { type: "iso_14001", issuer: "TÜV Rheinland", no: "01 104 1234567", expires: "2028-03-14", verified: true },
      { type: "ce_cpr", verified: false },
    ],
    productCards: [
      { product: "anti_climb_358", name: "358 anti-climb panel", spec: "4.0 mm wire · 76.2 × 12.7 mm · hot-dip or PVC", photos: 3 },
      { product: "twin_wire_panel", name: "Twin-wire panel 8/6/8", spec: "50 × 200 mm · 2 030 – 2 430 mm high · powder over zinc", photos: 5 },
      { product: "gabion", name: "Gabion box", spec: "80 × 100 mm hex · 2.7 mm Zn-Al · 1 × 1 × 2 m", photos: 2 },
    ],
    updated: "2026-10-09",
  },
  {
    slug: "northline-fencing",
    name: "Northline Fencing Systems",
    orgType: "processor",
    categories: ["fencing"], applications: ["industrial_security"], materials: ["carbon_steel"],
    products: ["welded_mesh_panel", "fence_post", "gate"],
    processes: ["fabrication", "powder_coating"],
    country: "GB",
    city: "Sheffield",
    founded: 1998,
    employees: "51_200",
    claimed: true,
    verifiedAt: "2026-09-18",
    summary: "Security fencing fabricator and installer serving utilities, data centres and transport. Fabricates posts and gates in-house; sources panels from audited producers.",
    exportMarkets: ["europe"],
    certifications: [
      { type: "iso_9001", issuer: "BSI", no: "FS 123456", expires: "2027-11-02", verified: true },
      { type: "lpcb", issuer: "BRE Global", no: "1234a", expires: "2027-06-30", verified: true },
    ],
    productCards: [
      { name: "Rated perimeter system SR2", spec: "358 panel on rated posts · 3 m · LPS 1175 B3", photos: 4 },
      { name: "Cantilever sliding gate", spec: "Up to 12 m clear · matched rating", photos: 3 },
    ],
    updated: "2026-10-02",
  },
  {
    slug: "silvermesh-filtration",
    name: "SilverMesh Filtration",
    orgType: "manufacturer",
    categories: ["filtration"], applications: ["energy_environment"], materials: ["stainless"],
    products: ["woven_wire_cloth", "filter_disc", "filter_element"],
    processes: ["weaving", "sintering", "cleanroom_finishing"],
    country: "DE",
    subdivision: "DE-NW",
    city: "Düren",
    founded: 1952,
    employees: "201_500",
    claimed: true,
    verifiedAt: "2026-10-01",
    summary: "Stainless woven wire cloth and sintered laminates for process filtration, pharmaceutical and food screening. Cleanroom finishing added in 2026.",
    exportMarkets: ["europe", "north_america", "east_asia"],
    certifications: [
      { type: "iso_9001", issuer: "DEKRA", no: "50012345 QM15", expires: "2028-01-20", verified: true },
      { type: "iso_14001", issuer: "DEKRA", no: "50012345 UM15", expires: "2028-01-20", verified: true },
    ],
    productCards: [
      { name: "Dutch weave filter cloth", spec: "AISI 316L · 20 – 2 µm nominal · rolls and cut pieces", photos: 3 },
      { name: "Sintered 5-layer laminate", spec: "1.7 mm · 2 – 100 µm · pleatable", photos: 2 },
    ],
    updated: "2026-10-06",
  },
  {
    slug: "terraweave-gabions",
    name: "TerraWeave Gabions",
    orgType: "manufacturer",
    categories: ["reinforcement"], applications: ["architecture", "energy_environment"], materials: ["carbon_steel"],
    products: ["gabion", "rockfall_netting"],
    processes: ["double_twist_weaving", "pvc_coating"],
    country: "IT",
    city: "Bergamo",
    founded: 1979,
    employees: "501_1000",
    claimed: true,
    verifiedAt: "2026-08-22",
    summary: "Double-twist hexagonal mesh products for erosion control, retaining structures and rockfall protection, with in-house engineering support.",
    exportMarkets: ["europe", "middle_east", "africa", "latin_america"],
    certifications: [{ type: "iso_9001", issuer: "Bureau Veritas", no: "IT123456", expires: "2027-09-10", verified: true }, { type: "ce_cpr", issuer: "Notified body 0123", verified: true }],
    productCards: [
      { name: "PVC-coated gabion box", spec: "80 × 100 mm · 2.7/3.7 mm · Zn-Al + PVC", photos: 4 },
      { name: "Reno mattress", spec: "60 × 80 mm · 0.17 – 0.30 m thick", photos: 2 },
    ],
    updated: "2026-09-12",
  },
  { slug: "gridtech-grating", name: "GridTech Grating", orgType: "manufacturer", categories: ["access"], applications: ["architecture", "industrial_security"], materials: ["carbon_steel", "stainless"], products: ["steel_grating", "stair_tread", "safety_grating"], processes: ["pressure_locking", "galvanizing"], country: "US", subdivision: "US-TX", city: "Houston", founded: 1986, employees: "201_500", claimed: true, verifiedAt: "2026-09-05", summary: "Welded and press-locked steel bar grating, stair treads and safety grating for industrial platforms and infrastructure.", exportMarkets: ["north_america", "latin_america"], certifications: [{ type: "iso_9001", issuer: "ABS QE", no: "12345", expires: "2027-04-01", verified: true }], productCards: [{ name: "Welded bar grating 19-W-4", spec: "1 ¼ × 3/16 in · hot-dip", photos: 3 }], updated: "2026-09-20" },
  { slug: "pacific-wire-cloth", name: "Pacific Wire Cloth", orgType: "distributor", categories: ["filtration", "materials_services"], applications: ["energy_environment"], materials: ["stainless", "other_alloys"], products: ["woven_wire_cloth", "perforated_metal", "expanded_metal"], country: "US", subdivision: "US-CA", city: "Los Angeles", founded: 1972, employees: "11_50", claimed: false, summary: "Stockist of woven wire cloth, perforated and expanded metal with cut-to-size service across the western United States.", certifications: [], productCards: [], updated: "2026-07-15" },
  { slug: "meshworks-india", name: "MeshWorks India", orgType: "manufacturer", categories: ["fencing", "reinforcement"], applications: ["agriculture", "industrial_security"], materials: ["carbon_steel"], products: ["chain_link", "welded_mesh_roll", "barbed_wire"], processes: ["weaving", "galvanizing"], country: "IN", subdivision: "IN-GJ", city: "Rajkot", founded: 2009, employees: "51_200", claimed: true, verifiedAt: "2026-08-30", summary: "Chain link, welded rolls and barbed wire for agricultural and industrial fencing, supplying the domestic market and East Africa.", exportMarkets: ["south_asia", "africa", "middle_east"], certifications: [{ type: "iso_9001", issuer: "IRQS", no: "IN-9001-5678", expires: "2027-12-31", verified: true }], productCards: [{ name: "Chain link fabric", spec: "2.0 – 4.0 mm · 25 – 75 mm · GI or PVC", photos: 2 }], updated: "2026-09-01" },
  { slug: "arcmesh-fabrication", name: "ArcMesh Fabrication", orgType: "processor", categories: ["access", "fencing"], applications: ["architecture"], materials: ["carbon_steel", "stainless"], products: ["expanded_metal", "architectural_mesh", "gate"], processes: ["laser_cutting", "powder_coating"], country: "NL", city: "Eindhoven", founded: 2011, employees: "11_50", claimed: true, verifiedAt: "2026-09-25", summary: "Architectural mesh and expanded-metal fabrication for façades, balustrades and screening, with in-house finishing.", exportMarkets: ["europe"], certifications: [], productCards: [{ name: "Façade cassette, expanded metal", spec: "Aluminium 3 mm · 62 × 23 mm · PVDF", photos: 5 }], updated: "2026-10-01" },
  { slug: "lusitania-wire", name: "Lusitânia Wire", orgType: "manufacturer", categories: ["materials_services"], applications: ["agriculture"], materials: ["carbon_steel"], products: ["drawn_wire", "coating_service", "wire_rod"], processes: ["drawing", "galvanizing"], country: "PT", city: "Aveiro", founded: 1964, employees: "201_500", claimed: false, summary: "Drawn and galvanized low-carbon and high-tensile wire supplied to mesh and fence producers across Iberia and North Africa.", certifications: [], productCards: [], updated: "2026-06-10" },
  { slug: "kobe-mesh-testing", name: "Kobe Mesh Testing Laboratory", orgType: "testing_lab", categories: ["materials_services"], applications: ["industrial_security"], materials: ["carbon_steel", "stainless"], products: ["testing_service"], country: "JP", city: "Kobe", founded: 1995, employees: "11_50", claimed: true, verifiedAt: "2026-09-10", summary: "Accredited laboratory for coating weight, tensile and weld shear testing of wire and mesh products.", certifications: [{ type: "iso_17025", issuer: "JAB", no: "RTL01234", expires: "2028-05-31", verified: true }], productCards: [], updated: "2026-09-10" },
  { slug: "andes-fence", name: "Andes Fence", orgType: "distributor", categories: ["fencing"], applications: ["sports_lifestyle", "agriculture"], materials: ["carbon_steel"], products: ["welded_mesh_panel", "chain_link", "fence_post"], country: "CL", city: "Santiago", founded: 2015, employees: "11_50", claimed: false, summary: "Distributor of fencing systems for mining and infrastructure projects in Chile and Peru.", certifications: [], productCards: [], updated: "2026-05-02" },
  { slug: "nordic-weld-machines", name: "Nordic Weld Machines", orgType: "machinery", categories: ["materials_services"], applications: ["industrial_security"], materials: ["carbon_steel"], products: ["mesh_machinery", "wire_rod"], country: "SE", city: "Jönköping", founded: 1988, employees: "51_200", claimed: true, verifiedAt: "2026-09-28", summary: "Mesh welding lines and wire straightening equipment with in-line weld monitoring.", exportMarkets: ["europe", "north_america", "east_asia"], certifications: [{ type: "iso_9001", issuer: "RISE", no: "SE-1234", expires: "2027-08-15", verified: true }], productCards: [{ name: "Panel welding line PW-3000", spec: "3 – 8 mm · 3 000 mm width · in-line shear test", photos: 4 }], updated: "2026-09-28" },
];

export const getCompany = (slug: string) => COMPANIES.find((c) => c.slug === slug);
export const companiesByCategory = (cat: string) => COMPANIES.filter((c) => c.categories.includes(cat));
export const recentlyUpdated = (n = 4) => [...COMPANIES].sort((a, b) => (a.updated < b.updated ? 1 : -1)).slice(0, n);

export const EVENTS: EventItem[] = [
  { slug: "autumn-fencing-security-show-2026", name: "Autumn Fencing & Security Show", type: "trade_show", start: "2026-09-22", end: "2026-09-24", city: "Birmingham", country: "GB", venue: "NEC", focus: "Fencing & security", summary: "Three days of perimeter fencing, gates and access control; the season's best read on specification trends.", weAttend: true, report: "autumn-show-season-fencing-demand" },
  { slug: "wire-machinery-days-2026", name: "Wire & Mesh Machinery Days", type: "trade_show", start: "2026-09-08", end: "2026-09-10", city: "Hanover", country: "DE", venue: "Hannover Messe", focus: "Machinery", summary: "Welding, weaving and straightening lines from European and Asian builders, most of them running live.", weAttend: true, report: "five-machines-worth-a-second-look" },
  { slug: "asia-mesh-fair-2026", name: "Asia Wire Mesh Fair", type: "trade_show", start: "2026-08-19", end: "2026-08-21", city: "Shanghai", country: "CN", venue: "SNIEC", focus: "Wire mesh & fencing", summary: "The largest mesh-only show in Asia, with a strong export and machinery hall. We did not attend this year." },
  { slug: "wire-mesh-expo-dusseldorf-2026", name: "International Wire & Mesh Expo", type: "trade_show", start: "2026-11-04", end: "2026-11-07", city: "Düsseldorf", country: "DE", venue: "Messe Düsseldorf", focus: "Fencing", summary: "Wire, mesh and fencing machinery and products across four halls. The largest meeting point for European buyers before the winter order round.", weAttend: true, website: "https://example.com" },
  { slug: "coating-standards-webinar-nov-2026", name: "Coating standards update: EN 10244 and ISO 1461 in practice", type: "webinar", start: "2026-11-19", online: true, organiser: "European Galvanizers Association", focus: "Standards", summary: "What changed in the latest editions and how to specify against them.", website: "https://example.com" },
  { slug: "grating-infrastructure-conference-2026", name: "Grating & Walkway Infrastructure Conference", type: "conference", start: "2026-12-02", end: "2026-12-03", city: "Birmingham", country: "GB", venue: "ICC", focus: "Steel grating", summary: "Load tables, slip resistance and the new access standards for industrial platforms.", website: "https://example.com" },
  { slug: "wire-south-asia-2027", name: "Wire South Asia", type: "trade_show", start: "2027-03-12", end: "2027-03-15", city: "Mumbai", country: "IN", venue: "Bombay Exhibition Centre", focus: "Wire & cable", summary: "Wire drawing, mesh welding and fencing products for South Asian and Gulf buyers.", website: "https://example.com" },
  { slug: "perimeter-security-summit-2027", name: "Perimeter Security Summit", type: "conference", start: "2027-04-21", end: "2027-04-22", city: "Dubai", country: "AE", venue: "DWTC", focus: "Security fencing", summary: "Rated fencing, gates and detection for critical infrastructure and data centres.", weAttend: true, website: "https://example.com" },
  { slug: "fencetech-2027", name: "FenceTech", type: "trade_show", start: "2027-02-17", end: "2027-02-19", city: "Nashville", country: "US", venue: "Music City Center", focus: "Fencing", summary: "North America's fencing industry show, from residential to high-security.", website: "https://example.com" },
  { slug: "filtration-screening-forum-2027", name: "Filtration & Screening Forum", type: "conference", start: "2027-05-06", city: "Cologne", country: "DE", venue: "Koelnmesse", focus: "Filtration", summary: "Woven and sintered media for process industries; a focus on cleanroom and pharmaceutical requirements.", website: "https://example.com" },
  { slug: "mesh-welding-technology-webinar-2027", name: "In-line weld monitoring: a practical introduction", type: "webinar", start: "2027-01-28", online: true, organiser: "Nordic Weld Machines", focus: "Manufacturing", summary: "Vendor-hosted technical session; attendance is free. Listed as an industry event, not endorsed.", website: "https://example.com" },
];

export const getEvent = (slug: string) => EVENTS.find((e) => e.slug === slug);
export const upcomingEvents = (from = "2026-10-12") => EVENTS.filter((e) => e.start >= from).sort((a, b) => (a.start > b.start ? 1 : -1));

/** Paid placements (Directory-D sponsored block). Kept apart from COMPANIES: they never enter the editorial list, its counts or its order. Wording is supplied by the sponsor; editors only check it for policy breaches. */
export type Sponsored = { name: string; role: string; country: string; blurb: string; tags: string[]; url: string; open?: boolean };
export const SPONSORED: Sponsored[] = [
  { name: "This placement is open", role: "Sponsored listing", country: "—", blurb: "Your company in your own words, with one outbound link and extra product-photo slots. Always marked SPONSORED; it never changes the editorial list or its order.", tags: ["Your products", "Your markets"], url: "/advertise/", open: true },
];
