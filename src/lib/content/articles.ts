import type { Article, Block, SectionCode } from "./types";

/* ------------------------------------------------------------------ */
/* Helpers to keep the mock corpus compact                             */
/* ------------------------------------------------------------------ */
const P = (html: string): Block => ({ type: "p", html });
const H = (id: string, text: string): Block => ({ type: "h2", id, text });

function genericBody(topic: string, standard?: string): Block[] {
  return [
    P(
      `Most disputes about ${topic} start with a word that sounds precise and is not. Two parties agree a specification, both believe they understand it, and the disagreement only surfaces when a test report lands on someone's desk.`,
    ),
    P(
      `This piece sets out what the term actually commits a supplier to, where the usual misreadings come from, and what to ask for in writing before an order is placed${standard ? ` — with reference to <a class="std-link" href="/standards/${standard.toLowerCase().replace(/[\s/]+/g, "-")}">${standard}</a> where it applies` : ""}.`,
    ),
    H("s1", "What the term covers"),
    P(
      "The definition is narrower than most buyers assume. It describes a measured property under stated conditions, not a guarantee of performance in service. The conditions matter as much as the number.",
    ),
    { type: "ul", items: ["State the measurement method, not just the value.", "Name the reference standard and its edition year.", "Say who tests, where, and on what sample."] },
    H("s2", "Where the misreadings come from"),
    P(
      "Catalogue language, regional habits and translated documents each introduce their own drift. None of them is dishonest; all of them produce numbers that cannot be compared.",
    ),
    { type: "ad" },
    H("s3", "What to put in writing"),
    P(
      "A single sentence in the purchase order removes most of the ambiguity: the property, the method, the acceptance limit and the document that will prove it. Everything else in this guide is an expansion of that sentence.",
    ),
    { type: "checklist", title: "Before you sign", items: ["Property named with units", "Test method and standard edition", "Sampling plan agreed", "Who pays for a failed retest"] },
  ];
}

const AUTH = { lin: "mei-lin", obi: "daniel-obi", kra: "hanna-kraus", rey: "tomas-reyes" };

type Seed = Omit<Article, "body" | "readMin"> & { body?: Block[]; readMin?: number };

const seeds: Seed[] = [
  /* ============================ HERO / FEATURED ============================ */
  {
    slug: "eu-anti-dumping-duty-welded-mesh-rises",
    section: "market_insights",
    subsection: "trade_policy",
    type: "news",
    title: "EU raises anti-dumping duty on welded mesh to 31.7% — what changes for importers from November",
    dek: "The definitive measure lands a month earlier than most traders expected. Here is who pays, who is exempt, and the paperwork that now decides the rate.",
    date: "2026-10-12",
    author: AUTH.obi,
    tags: ["Anti-dumping", "EU", "Welded mesh", "Trade policy"],
    topics: ["anti-dumping-tracker"],
    mesh: "weld",
    featured: true,
    hero: 2,
    takeaways: ["Definitive duty of 31.7% applies to consignments cleared from 3 November", "Two producers hold individual rates below 20%; the certificate of origin decides", "Stock already in bonded warehouses is assessed at the provisional rate"],
    marketSeries: ["wire_rod_eu", "hrc_eu"],
    body: [
      P("The European Commission has published the definitive anti-dumping measure on welded wire mesh panels, confirming a residual duty of <strong>31.7%</strong> and bringing the application date forward to 3 November. Provisional duties had been running at 24.9% since April."),
      P("For importers the practical change is less the rate than the documentation. The individual rates granted to two cooperating producers now depend on a mill certificate that names the producing plant, not the trading company that invoices the goods."),
      H("s1", "Who pays what"),
      { type: "table", head: ["Origin / producer", "Rate", "Condition"], rows: [["Residual (all others)", "31.7%", "—"], ["Cooperating producer A", "17.2%", "Mill certificate + plant code"], ["Cooperating producer B", "19.8%", "Mill certificate + plant code"], ["Goods in bonded warehouse before 3 Nov", "24.9%", "Entry date evidence"]] },
      H("s2", "What moves next"),
      P("Spot offers for December delivery into Rotterdam moved up within hours of publication. Wire rod, the main input, did not: the duty is on panels, and rod producers outside the measure's scope see the demand shift rather than lose it."),
      { type: "ad" },
      H("s3", "What to do this week"),
      { type: "checklist", title: "Importer checklist", items: ["Confirm plant code on every mill certificate", "Separate bonded stock by entry date", "Re-price open quotations with 31.7% residual", "Ask producers about individual-rate eligibility"] },
    ],
    sources: [
      { title: "Commission Implementing Regulation — welded wire mesh (definitive measure)", url: "https://eur-lex.europa.eu/", accessed: "2026-10-12" },
      { title: "TARIC consultation — CN 7314 20", url: "https://ec.europa.eu/taxation_customs/dds2/taric/", accessed: "2026-10-12" },
    ],
  },
  {
    slug: "airport-perimeter-upgrade-specifies-358-mesh",
    section: "news",
    subsection: "projects_case_studies",
    type: "case_study",
    title: "12 km of airport fence line, and the detail that nearly failed it",
    dek: "A perimeter upgrade specified 358 anti-climb mesh, passed every factory test, and almost failed at site acceptance over a clause nobody had read twice.",
    date: "2026-10-09",
    author: AUTH.lin,
    tags: ["358 mesh", "Perimeter security", "Acceptance testing"],
    standards: ["EN 10223-4", "EN 10244-2"],
    companies: ["hengtai-mesh", "northline-fencing"],
    topics: ["perimeter-security"],
    mesh: "weld",
    featured: true,
    hero: 3,
    takeaways: ["Coating weight was specified bath-side; acceptance measured on site", "The gap was 12 g/m², inside tolerance once the method was agreed", "Write the measurement location into the contract, not just the number"],
    body: [
      P("The contract said galvanised to <a class=\"std-link\" href=\"/standards/en-10244-2\">EN 10244-2</a> class A. The factory certificate said the same. The site inspector's gauge said something else, and for nine days the project sat on a question that should have been settled on page one of the specification."),
      H("s1", "The specification"),
      P("358 mesh — 76.2 × 12.7 mm apertures in 4 mm wire — was chosen for anti-climb performance. The coating clause referenced the standard correctly but did not state where the coating weight would be measured."),
      { type: "spec", title: "Quick spec · 358 security mesh", rows: [["Aperture", "76.2 × 12.7 mm"], ["Wire", "4.0 mm"], ["Panel", "2 515 × 3 000 mm"], ["Coating", "Hot-dip, class A"]], standards: ["EN 10223-4", "EN 10244-2", "ASTM A392"] },
      H("s2", "What the inspector found"),
      P("Readings on site averaged 12 g/m² below the certificate. Both numbers were honest: one was taken on wire before welding, the other on finished panel after handling and transport."),
      { type: "quote", text: "The standard allows either. The contract should have chosen one.", cite: "Project QA lead" },
      { type: "ad" },
      H("s3", "How it was resolved"),
      P("The parties agreed a measurement protocol — finished panel, three points per sample, five samples per lot — and retested. Every lot passed. The protocol now sits in the client's standard specification."),
    ],
    sources: [{ title: "EN 10223-4 scope summary — Standards Index", url: "/standards/en-10223-4", accessed: "2026-10-09" }],
  },
  {
    slug: "zinc-premium-eases-coating-cost-sticky",
    section: "market_insights",
    subsection: "materials_costs",
    type: "analysis",
    title: "Zinc premium eases, but coating surcharges are not following it down",
    dek: "LME zinc has given back most of its summer gain. Galvanizers say the surcharge is about energy and bath utilisation, not metal — and the numbers back them up.",
    date: "2026-10-11",
    author: AUTH.obi,
    tags: ["Zinc", "Galvanizing", "Surcharges"],
    topics: ["zinc-coating-costs"],
    mesh: "perf",
    featured: true,
    marketSeries: ["zinc_3m", "zinc_cash"],
    takeaways: ["Zinc 3-month is down 6% from the August high", "Galvanizing surcharges are flat to up in three of four regions", "Energy is now a larger share of coating cost than zinc"],
    body: genericBody("galvanizing surcharges"),
  },

  /* ============================ NEWS ============================ */
  { slug: "mesh-producer-commissions-heavy-gauge-panel-line", section: "news", subsection: "company_news", type: "news", title: "Mesh producer commissions heavy-gauge panel line for export fencing", dek: "A new welded-mesh line rated to 8 mm wire targets security and infrastructure panels for European and Gulf buyers.", date: "2026-10-12", author: AUTH.lin, tags: ["Welded mesh", "Capacity"], companies: ["hengtai-mesh"], mesh: "weld" },
  { slug: "weld-shear-testing-moves-in-line", section: "news", subsection: "product_technology", type: "news", title: "Weld shear testing moves in-line at two panel plants", dek: "In-line testing changes when defects are found — and what a quality report can honestly say.", date: "2026-10-10", author: AUTH.lin, tags: ["Welding", "Quality"], mesh: "weldQ" },
  { slug: "autumn-show-season-fencing-demand", section: "news", subsection: "events_exhibitions", type: "analysis", title: "What the autumn show season said about fencing demand", dek: "Three halls, two continents, one consistent message from buyers: specification is getting tighter, lead time is getting shorter.", date: "2026-09-28", author: AUTH.rey, tags: ["Trade shows", "Demand"], mesh: "chain" },
  { slug: "five-machines-worth-a-second-look", section: "news", subsection: "events_exhibitions", type: "news", title: "Five machines worth a second look from the wire hall", dek: "From a weld-current monitor to a panel flatness gauge that fits in a pocket.", date: "2026-09-14", author: AUTH.rey, tags: ["Machinery", "Trade shows"], mesh: "grate" },
  { slug: "stainless-filtration-mesh-supplier-adds-cleanroom-line", section: "news", subsection: "company_news", type: "news", title: "Stainless filtration mesh supplier adds cleanroom finishing line", dek: "The investment targets pharmaceutical and food-grade screens where particle counts, not tensile numbers, win the order.", date: "2026-10-06", author: AUTH.kra, tags: ["Filtration", "Stainless"], companies: ["silvermesh-filtration"], mesh: "woven" },
  { slug: "gabion-retaining-wall-coastal-road", section: "news", subsection: "projects_case_studies", type: "case_study", title: "Gabion retaining wall survives first storm season on a coastal road", dek: "PVC-over-zinc wire, a drainage detail nobody wanted to pay for, and what the monitoring data showed after six months.", date: "2026-10-03", author: AUTH.kra, tags: ["Gabions", "Coastal", "Infrastructure"], companies: ["terraweave-gabions"], mesh: "chainL", appliesTo: ["Coastal exposure", "Retaining structures"] },
  { slug: "data-centre-perimeter-standards-tighten", section: "news", subsection: "projects_case_studies", type: "news", title: "Data-centre operators converge on a tighter perimeter specification", dek: "Three hyperscale tenders in a quarter asked for the same thing: rated mesh, rated gates, and a named test house.", date: "2026-09-30", author: AUTH.lin, tags: ["Data centres", "Security rating"], topics: ["data-centre-build-out", "perimeter-security"], mesh: "weld" },

  /* ============================ MARKET INSIGHTS ============================ */
  { slug: "steel-wire-rod-prices-steady-into-q4", section: "market_insights", subsection: "materials_costs", type: "analysis", title: "Steel wire rod prices steady into Q4 as mills hold offers", dek: "Flat rod, flat demand, and a quiet freight market: the quarter opens without a catalyst in either direction.", date: "2026-10-08", author: AUTH.obi, tags: ["Wire rod", "Steel"], marketSeries: ["wire_rod_eu"], mesh: "g3" },
  { slug: "container-rates-and-what-they-add", section: "market_insights", subsection: "supply_chain", type: "analysis", title: "Container rates and what they actually add to a mesh order", dek: "A worked example from a 40-ft box of fence panels: the freight line on the invoice is smaller than most buyers fear, and more volatile than most sellers admit.", date: "2026-10-05", author: AUTH.obi, tags: ["Freight", "Landed cost"], marketSeries: ["container_asia_eu"], topics: ["freight-lead-times"] },
  { slug: "smelter-maintenance-season-zinc-supply", section: "market_insights", subsection: "materials_costs", type: "analysis", title: "Smelter maintenance season: the supply side of the zinc chart", dek: "Four smelters, six weeks, and a tightness that shows up in premiums before it shows up in the exchange price.", date: "2026-10-03", author: AUTH.obi, tags: ["Zinc", "Supply"], marketSeries: ["zinc_3m", "zinc_cash"], topics: ["zinc-coating-costs"] },
  { slug: "why-zinc-premiums-widened-in-q3", section: "market_insights", subsection: "materials_costs", type: "analysis", title: "Why zinc premiums widened in Q3 and what it means for galvanizing surcharges", dek: "The exchange price tells half the story. Regional premiums tell the half that reaches a fence buyer's invoice.", date: "2026-10-11", author: AUTH.obi, tags: ["Zinc", "Premiums"], marketSeries: ["zinc_3m"], topics: ["zinc-coating-costs"] },
  { slug: "us-section-232-derivatives-mesh", section: "market_insights", subsection: "trade_policy", type: "analysis", title: "US Section 232 derivatives list: where mesh and grating now sit", dek: "The latest inclusion round adds three tariff lines that matter to this industry. A plain reading of the scope language.", date: "2026-09-26", author: AUTH.obi, tags: ["US tariffs", "Section 232"], topics: ["anti-dumping-tracker"] },
  { slug: "solar-fencing-demand-outpaces-utility-build", section: "market_insights", subsection: "demand_trends", type: "analysis", title: "Solar-site fencing demand is outpacing the utility build it follows", dek: "Perimeter metres per megawatt are rising as sites get smaller and more numerous. The arithmetic for mesh suppliers.", date: "2026-09-22", author: AUTH.obi, tags: ["Solar", "Demand"], mesh: "perf" },
  { slug: "lead-times-welded-panels-europe-autumn", section: "market_insights", subsection: "supply_chain", type: "news", title: "Lead times for welded panels in Europe shorten to six weeks", dek: "Stock has rebuilt faster than orders. The first autumn in three years where delivery is not the negotiation.", date: "2026-10-01", author: AUTH.obi, tags: ["Lead times", "Europe"], topics: ["freight-lead-times"] },

  /* ============================ APPLICATIONS ============================ */
  { slug: "facade-mesh-ventilated-cladding-what-to-specify", section: "applications", subsection: "architecture", type: "guide", title: "Expanded-metal façades: what the architect specifies and what the installer needs", dek: "Open area, strand orientation and fixing centres decide how the façade looks at 50 metres and how it behaves at 50 km/h.", date: "2026-10-07", author: AUTH.kra, tags: ["Façades", "Expanded metal", "Architecture"], mesh: "exp", appliesTo: ["Ventilated cladding", "Sun screening"] },
  { slug: "site-perimeter-security-rating-explained", section: "applications", subsection: "industrial_security", type: "guide", title: "Site perimeter security ratings, explained without the sales language", dek: "LPS 1175, attack time and tool categories: how a rating is earned and why a rated panel on unrated posts is not a rated fence.", date: "2026-10-04", author: AUTH.lin, tags: ["Security rating", "LPS 1175"], topics: ["perimeter-security"], mesh: "weld" },
  { slug: "livestock-fencing-knots-and-tensions", section: "applications", subsection: "agriculture", type: "guide", title: "Livestock fencing: knot types, tension and the ground that decides both", dek: "Fixed knot, hinge joint and the wire gauge each one asks for. A field guide for specifiers who have never strained a fence.", date: "2026-09-29", author: AUTH.kra, tags: ["Agriculture", "Woven wire"], mesh: "woven" },
  { slug: "solar-site-fencing-wildlife-and-security", section: "applications", subsection: "energy_environment", type: "guide", title: "Solar-site fencing has to let wildlife through and keep people out", dek: "Small-mammal gaps, cable-theft deterrence and a grounding detail that keeps showing up in snag lists.", date: "2026-09-24", author: AUTH.kra, tags: ["Solar", "Wildlife"], mesh: "perf" },
  { slug: "ball-court-fencing-rebound-and-noise", section: "applications", subsection: "sports_lifestyle", type: "guide", title: "Ball-court fencing: rebound, noise and the mesh that handles both", dek: "Why twin-wire panels took the sports market from chain link, and where chain link still wins.", date: "2026-09-19", author: AUTH.rey, tags: ["Sports", "Twin-wire"], mesh: "chain" },

  /* ============================ TECHNICAL GUIDES ============================ */
  {
    slug: "wire-diameter-mesh-opening-coating-balance",
    section: "technical_guides",
    subsection: "specifications_tolerances",
    type: "guide",
    title: "Wire diameter, mesh opening, coating: how to balance the three",
    dek: "Diameter is the number buyers negotiate on. Opening and coating are the numbers that decide whether the fence does its job. A method for getting the order right.",
    date: "2026-10-06",
    updated: "2026-10-11",
    readMin: 14,
    author: AUTH.lin,
    tags: ["Welded mesh", "Galvanizing", "Perimeter security", "Specification"],
    standards: ["EN 10223-4", "EN 10244-2", "ASTM A392"],
    topics: ["perimeter-security"],
    mesh: "weldQ",
    featured: true,
    hero: 1,
    highlight: "coating",
    appliesTo: ["Welded panel fencing", "Chain link fabric", "358 / prison mesh", "Perimeter & security"],
    takeaways: ["Fix the threat level first; it sets the opening", "Diameter buys stiffness, not life — coating buys life", "Specify coating by weight and measurement location, never by the word 'galvanised'"],
    body: [
      P("<span class=\"dropcap\">A</span> specification that starts with wire diameter has already made its most expensive decision by accident. Diameter is the easiest number to compare across quotations, so it becomes the number buyers negotiate on — and the two variables that actually decide whether the fence does its job, mesh opening and coating, get whatever is left."),
      P("This guide reverses that order. The method below fixes the mesh opening against a defined threat, sets the coating against the measured environment (the zinc classes of <a class=\"std-link\" href=\"/standards/en-10244-2\">EN 10244-2</a> are the usual reference), and only then chooses the lightest wire that carries the panel. In nine out of ten perimeter jobs that sequence produces a cheaper fence with a longer service life than the one specified diameter-first."),
      { type: "spec", title: "Quick spec · 358 security mesh", rows: [["Aperture", "76.2 × 12.7 mm"], ["Wire", "4.0 mm"], ["Panel", "2 515 × 3 000 mm"], ["Coating", "Hot-dip, class A"]], standards: ["EN 10223-4", "EN 10244-2", "ASTM A392"] },
      H("s1", "01 · The three variables"),
      P("Opening governs what can pass through and what can get a grip. Coating governs how long the wire keeps its section. Diameter governs stiffness, panel flatness and — only indirectly — strength."),
      { type: "figure", caption: "Fig. 1 — The same 4 mm wire at three openings. Anti-climb performance changes by an order of magnitude; material cost changes by a third.", source: "Wire Mesh News", mesh: "weldQ" },
      H("s2", "02 · Fix the threat level first"),
      P("Decide what the fence must stop: casual climbing, determined climbing with tools, vehicle contact, or small animals. Each has a well-documented opening range. Choosing the opening before the threat is choosing a fence before a problem."),
      { type: "table", head: ["Threat", "Typical opening", "Notes"], rows: [["Casual climbing", "50 × 200 mm", "Twin-wire or single panel"], ["Determined, hand tools", "76.2 × 12.7 mm", "358 mesh; rated posts"], ["Vehicle contact", "Any", "Posts and footing govern"], ["Small animals", "≤ 25 mm at base", "Often a lower add-on panel"]], caption: "Indicative ranges; verify against the project's threat assessment." },
      H("s3", "03 · Set the coating against the environment"),
      P("Coating is specified by zinc weight per square metre, measured at an agreed point in the process. The ISO 9223 corrosivity class of the site gives the design life for each coating class. 'Galvanised' on its own commits the supplier to nothing measurable."),
      { type: "ad" },
      H("s4", "04 · Then choose the wire"),
      P("With opening and coating fixed, pick the lightest wire that keeps the panel flat at the chosen span and survives handling. Heavier wire does not extend life; coating does."),
      H("s5", "05 · Putting it in the order"),
      { type: "checklist", title: "Specification self-check", items: ["Opening stated with tolerance and reference standard", "Coating stated by g/m², class, and measurement location", "Wire diameter stated with tolerance after coating", "Panel size, post spacing and fixing method stated", "Acceptance test method and sampling plan named"] },
    ],
    sources: [
      { title: "EN 10223-4 — Steel wire and wire products for fencing, Part 4 (summary)", url: "/standards/en-10223-4", accessed: "2026-10-06" },
      { title: "EN 10244-2 — Zinc coatings on steel wire (summary)", url: "/standards/en-10244-2", accessed: "2026-10-06" },
      { title: "ISO 9223 — Corrosivity of atmospheres (summary)", url: "/standards/iso-9223", accessed: "2026-10-06" },
    ],
  },
  { slug: "powder-coat-over-galvanizing-adhesion", section: "technical_guides", subsection: "surface_treatments", type: "guide", title: "Powder coat over galvanizing: why adhesion fails and how to prevent it", dek: "Most peeling traces back to surface preparation, not to the powder. What to specify, what to witness, and what a failed adhesion test actually proves.", date: "2026-10-07", author: AUTH.lin, tags: ["Powder coating", "Galvanizing", "Adhesion"], standards: ["EN 10244-2"], series: { slug: "coatings-from-spec-to-site", part: 2 }, mesh: "perf", featured: true, body: genericBody("powder coat adhesion", "EN 10244-2") },
  { slug: "reading-a-steel-grating-load-table", section: "technical_guides", subsection: "standards_testing", type: "guide", title: "Reading a steel grating load table without guesswork", dek: "Span, load class and deflection limit interact — and the table usually assumes one of them silently. How to find which.", date: "2026-10-05", author: AUTH.kra, tags: ["Grating", "Load tables"], standards: ["DIN 24537-1"], mesh: "grate" },
  { slug: "mesh-opening-tolerance-standard-vs-assumed", section: "technical_guides", subsection: "specifications_tolerances", type: "guide", title: "Mesh opening tolerance: what the standard allows, what buyers assume", dek: "±3% sounds tight until it is applied to a 200 mm opening. A worked comparison across the common fencing standards.", date: "2026-10-03", author: AUTH.lin, tags: ["Tolerances", "Welded mesh"], standards: ["EN 10223-4", "ASTM A185"], body: genericBody("mesh opening tolerance", "EN 10223-4") },
  { slug: "low-carbon-high-tensile-or-stainless", section: "technical_guides", subsection: "materials", type: "guide", title: "Low-carbon, high-tensile or stainless: matching wire to the job", dek: "Tensile grade is a trade between formability, strength and coating uptake. The cases where each one is the wrong answer.", date: "2026-10-01", author: AUTH.kra, tags: ["Wire", "Materials"], standards: ["EN 10218-1"] },
  { slug: "resistance-welding-settings-and-defects", section: "technical_guides", subsection: "manufacturing", type: "guide", title: "Resistance welding settings and the defects they leave behind", dek: "Current, time and force — and the three visible signatures of getting one of them wrong.", date: "2026-09-28", author: AUTH.lin, tags: ["Welding", "Manufacturing"], mesh: "weld" },
  { slug: "post-spacing-wind-load-footing", section: "technical_guides", subsection: "installation_maintenance", type: "guide", title: "Post spacing, wind load and the footing that carries both", dek: "Span tables assume a soil. When the assumption fails, so does the table.", date: "2026-09-25", author: AUTH.rey, tags: ["Installation", "Wind load"], topics: ["perimeter-security"] },
  { slug: "stainless-grades-filtration-mesh-304-316", section: "technical_guides", subsection: "materials", type: "guide", title: "Stainless grades for filtration mesh: 304, 316 and when it matters", dek: "Chloride exposure, cleaning chemistry and weave type decide the grade more than temperature does.", date: "2026-09-22", author: AUTH.kra, tags: ["Stainless", "Filtration"], standards: ["ISO 9044"], mesh: "woven" },
  { slug: "coating-weight-chain-link-test-report", section: "technical_guides", subsection: "standards_testing", type: "guide", title: "Coating weight on chain link fabric: reading the test report", dek: "Reported as grams per square metre rather than thickness, so comparing two certificates means converting first.", date: "2026-09-18", author: AUTH.lin, tags: ["Chain link", "Coating weight", "Test reports"], standards: ["ASTM A392", "EN 10244-2"], mesh: "chain", series: { slug: "coatings-from-spec-to-site", part: 3 } },
  { slug: "what-en-10223-4-actually-requires", section: "technical_guides", subsection: "standards_testing", type: "guide", title: "What EN 10223-4 actually requires at acceptance", dek: "What to test, who tests it, and which lines must appear on the report before a lot is accepted.", date: "2026-09-12", author: AUTH.lin, tags: ["EN 10223-4", "Acceptance"], standards: ["EN 10223-4"], topics: ["perimeter-security"], body: genericBody("acceptance testing of welded mesh", "EN 10223-4") },
  { slug: "choosing-a-coating-system", section: "technical_guides", subsection: "surface_treatments", type: "guide", title: "Choosing a coating system: zinc, zinc-aluminium, PVC and duplex", dek: "Part 1 of the series. Environment first, then budget, then appearance — in that order.", date: "2026-09-08", author: AUTH.lin, tags: ["Coatings"], series: { slug: "coatings-from-spec-to-site", part: 1 }, standards: ["EN 10244-2", "ISO 9223"] },

  /* ============================ BUYING GUIDES ============================ */
  { slug: "what-a-complete-mesh-rfq-has-to-state", section: "buying_guides", subsection: "rfq_preparation", type: "guide", title: "What a complete mesh RFQ has to state", dek: "Eleven lines. Miss one and every quotation you receive is answering a different question.", date: "2026-10-10", author: AUTH.rey, tags: ["RFQ", "Procurement"], featured: true, body: genericBody("RFQ scope") },
  { slug: "why-the-cheapest-panel-loses-the-audit", section: "buying_guides", subsection: "cost_quote", type: "guide", title: "Why the cheapest panel loses the audit", dek: "Landed cost, coating life and the retest clause: a quotation comparison that puts the three on one page.", date: "2026-10-02", author: AUTH.rey, tags: ["Cost", "Quotes"] },
  { slug: "hot-dip-vs-electro-galvanizing-fence-posts", section: "buying_guides", subsection: "quality_inspection", type: "guide", title: "Hot-dip vs. electro-galvanizing for fence posts", dek: "The coating thickness difference between the two processes is an order of magnitude, which decides service life far more than the steel does.", date: "2026-10-02", author: AUTH.lin, tags: ["Galvanizing", "Posts"], standards: ["EN ISO 1461"], body: genericBody("galvanizing of fence posts", "EN ISO 1461") },
  { slug: "reading-a-mill-certificate-line-by-line", section: "buying_guides", subsection: "quality_inspection", type: "guide", title: "Reading a mill certificate line by line", dek: "Which lines prove something, which lines are copied from the order, and the one line that is usually missing.", date: "2026-09-27", author: AUTH.rey, tags: ["Mill certificate", "Inspection"], standards: ["EN 10204"], featured: true },
  { slug: "pre-shipment-inspection-practical-checklist", section: "buying_guides", subsection: "quality_inspection", type: "guide", title: "Pre-shipment inspection: a practical checklist", dek: "What to measure on the floor, and what to leave to the laboratory report.", date: "2026-09-30", author: AUTH.lin, tags: ["Inspection", "Checklist"] },
  { slug: "chain-link-vs-welded-mesh-cost", section: "buying_guides", subsection: "selection_comparison", type: "guide", title: "Chain link vs. welded mesh: a cost comparison that includes the posts", dek: "Per-metre panel price flatters welded mesh; per-metre installed price does not always.", date: "2026-09-20", author: AUTH.rey, tags: ["Chain link", "Welded mesh", "Cost"], mesh: "chain" },
  { slug: "where-358-mesh-beats-welded-panel", section: "buying_guides", subsection: "selection_comparison", type: "guide", title: "Where 358 mesh beats welded panel — and where it doesn't", dek: "Aperture size drives the whole comparison, from anti-climb performance to post wind load.", date: "2026-09-16", author: AUTH.lin, tags: ["358 mesh", "Comparison"], topics: ["perimeter-security"], mesh: "weld" },
  { slug: "assessing-threat-level-before-fence", section: "buying_guides", subsection: "selection_comparison", type: "guide", title: "Assessing the threat level before you choose a fence", dek: "Write down the site, the threat and the maintenance budget you can live with. Every later trade-off depends on those three lines.", date: "2026-09-10", author: AUTH.rey, tags: ["Security", "Selection"], topics: ["perimeter-security"] },
  { slug: "packing-mesh-panels-for-sea-freight", section: "buying_guides", subsection: "packing_shipping", type: "guide", title: "Packing mesh panels for sea freight: the damage that happens in the box", dek: "Edge protection, strapping tension and why 'palletised' means five different things.", date: "2026-09-05", author: AUTH.rey, tags: ["Packing", "Shipping"], topics: ["freight-lead-times"] },

  /* ============================ SPONSORED ============================ */
  { slug: "inside-the-plant-panel-flatness", section: "news", subsection: "company_news", type: "sponsored", sponsor: "Hengtai Mesh", title: "Inside the plant: how panel flatness is controlled from coil to crate", dek: "Paid for by Hengtai Mesh. A walk through the flatness checks on a heavy-gauge panel line.", date: "2026-09-03", author: AUTH.lin, tags: ["Sponsored"], companies: ["hengtai-mesh"] },
  { slug: "sponsored-cleanroom-screens-selection", section: "technical_guides", subsection: "materials", type: "sponsored", sponsor: "SilverMesh Filtration", title: "Selecting cleanroom-grade screens: a supplier's checklist", dek: "Paid for by SilverMesh Filtration. Mesh count, weave and finish for pharmaceutical screening.", date: "2026-09-15", author: AUTH.kra, tags: ["Sponsored"], companies: ["silvermesh-filtration"] },
];

function wordsToMin(body: Block[]): number {
  const words = body.reduce((n, b) => n + ("html" in b ? b.html.split(/\s+/).length : "text" in b ? String(b.text).split(/\s+/).length : 40), 0);
  return Math.max(4, Math.round(words / 180));
}

export const ARTICLES: Article[] = seeds
  .map((s) => {
    const generic = !s.body;
    const body = s.body ?? genericBody(s.tags[0]?.toLowerCase() ?? "specification", s.standards?.[0]);
    // generic bodies all weigh the same; spread read times deterministically 5–9 min
    const hash = [...s.slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7);
    const readMin = s.readMin ?? (generic ? 5 + (hash % 5) : wordsToMin(body));
    return { ...s, body, readMin } as Article;
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */
export const editorial = (a: Article) => a.type !== "sponsored";

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
export function bySection(section: SectionCode, limit?: number) {
  const list = ARTICLES.filter((a) => a.section === section && editorial(a));
  return limit ? list.slice(0, limit) : list;
}
export function bySubsection(section: SectionCode, sub: string) {
  return ARTICLES.filter((a) => a.section === section && a.subsection === sub && editorial(a));
}
export function latest(limit = 10, exclude: string[] = []) {
  return ARTICLES.filter((a) => editorial(a) && !exclude.includes(a.slug)).slice(0, limit);
}
export function heroSet() {
  const h = (n: 1 | 2 | 3) => ARTICLES.find((a) => a.hero === n)!;
  return [h(1), h(2), h(3)];
}
export function featured() {
  return ARTICLES.filter((a) => a.featured && editorial(a));
}
export function byTopic(topic: string) {
  return ARTICLES.filter((a) => a.topics?.includes(topic) && editorial(a));
}
export function byAuthor(author: string) {
  return ARTICLES.filter((a) => a.author === author);
}
export function byCompany(slug: string) {
  return ARTICLES.filter((a) => a.companies?.includes(slug));
}
export function byStandard(no: string) {
  return ARTICLES.filter((a) => a.standards?.includes(no) && editorial(a));
}
export function byMarketSeries(code: string, limit = 3) {
  const hit = ARTICLES.filter((a) => a.marketSeries?.includes(code) && editorial(a));
  return (hit.length ? hit : bySection("market_insights")).slice(0, limit);
}
export function sponsoredFor(section?: SectionCode) {
  return ARTICLES.find((a) => a.type === "sponsored" && (!section || a.section === section)) ?? ARTICLES.find((a) => a.type === "sponsored");
}
export function readNext(a: Article, n = 3) {
  const same = ARTICLES.filter((x) => x.slug !== a.slug && editorial(x) && (x.section === a.section || x.tags.some((t) => a.tags.includes(t))));
  return same.slice(0, n);
}
export function seriesParts(slug: string) {
  return ARTICLES.filter((a) => a.series?.slug === slug).sort((a, b) => a.series!.part - b.series!.part);
}
export function mostRead(n = 5) {
  const order = ["chain-link-vs-welded-mesh-cost", "what-en-10223-4-actually-requires", "reading-a-mill-certificate-line-by-line", "hot-dip-vs-electro-galvanizing-fence-posts", "what-a-complete-mesh-rfq-has-to-state"];
  return order.map((s) => getArticle(s)!).filter(Boolean).slice(0, n);
}
