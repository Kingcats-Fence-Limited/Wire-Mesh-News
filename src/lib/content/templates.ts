/* Specification templates and checklists (Tools). Written in our own words: they name the
   standards to cite but never reproduce their clauses, tables or values — buyers fill in the
   figures from the current official text. Two are free samples; the rest are for Pro. */

export type TemplateSection = { heading: string; items: string[] };
export type Template = {
  slug: string;
  title: string;
  kind: "specification" | "checklist" | "record";
  summary: string;
  products: string[];
  standards: string[];
  free?: boolean;
  sections: TemplateSection[];
};

const blank = "____________";

export const TEMPLATES: Template[] = [
  {
    slug: "welded-mesh-panel-purchase-spec",
    title: "Purchase specification: welded mesh fence panels",
    kind: "specification",
    summary: "A fill-in purchase specification for flat or V-pressed welded mesh panels, posts and fixings, ready to attach to an enquiry.",
    products: ["welded_mesh_panel", "fence_post"],
    standards: ["EN 10223-7", "EN 10244-2", "EN 13438"],
    free: true,
    sections: [
      { heading: "1. Scope", items: [`Project / site: ${blank}`, `Total fence length (m): ${blank}  · Number of gates: ${blank}`, "Supply only / supply and install (delete as applicable)", `Delivery terms (Incoterms 2020) and place: ${blank}`] },
      { heading: "2. Panel", items: [`Panel height × width (mm): ${blank}`, `Mesh aperture, centres (mm): ${blank} × ${blank}`, `Wire diameter, horizontal / vertical (mm) and tolerance: ${blank}`, "Panel profile: flat / V-pressed (number of folds: ___)", "Weld strength to be tested and reported per the product standard named in section 6", "Edge finish: barbed (tines) / smooth top / smooth bottom"] },
      { heading: "3. Posts and fixings", items: [`Post section and wall thickness (mm): ${blank}`, `Post length and embedment depth (mm): ${blank}`, "Base: concrete-in / base plate (plate size and anchor type: ___)", "Clip type and material; tamper-resistant fixings: yes / no", "Post caps: yes / no"] },
      { heading: "4. Corrosion protection", items: ["System: hot-dip galvanized wire before welding / after welding / galvanized + polyester powder coat", `Zinc coating class or mass (g/m²) and where it is measured (wire or panel): ${blank}`, `Powder coat colour (RAL) and minimum dry film thickness (µm): ${blank}`, "Pre-treatment before powder coating to be stated by the supplier"] },
      { heading: "5. Documents with the offer", items: ["Mill certificate for the wire rod (chemistry and tensile)", "Coating test report, stating the test method and measurement location", "Drawings of panel, post and fixings", "Packing method and number of panels per pallet and per container"] },
      { heading: "6. Standards to cite (buy the current official text)", items: ["Welded mesh fencing panels — product standard", "Zinc coatings on steel wire", "Powder coatings for galvanized steel"] },
      { heading: "7. Inspection and acceptance", items: ["Pre-shipment inspection by: buyer / third party (name: ___)", "Sampling plan and acceptance criteria agreed before production", "Non-conforming panels: replacement at supplier's cost within ___ days"] },
    ],
  },
  {
    slug: "pre-shipment-inspection-welded-mesh",
    title: "Pre-shipment inspection checklist: welded mesh panels",
    kind: "checklist",
    summary: "What to check at the factory before a container of welded mesh panels is loaded, with space for measurements.",
    products: ["welded_mesh_panel", "anti_climb_358", "twin_wire_panel"],
    standards: ["EN 10223-7", "EN 10244-2"],
    free: true,
    sections: [
      { heading: "Before you start", items: ["Purchase specification and approved drawings at hand", "Calibrated tools: micrometer, tape, coating thickness gauge (state type)", "Sample size agreed in the contract: ___ panels from ___ pallets"] },
      { heading: "Dimensions", items: [`Panel height and width vs drawing — measured: ${blank}`, `Aperture centres (measure 5 meshes) — measured: ${blank}`, `Wire diameter before coating (if accessible) / after coating: ${blank}`, "Panel squareness (diagonals) and flatness"] },
      { heading: "Welds", items: ["Every crossing welded; no burnt-through or cracked welds", "Weld shear test on samples, method and results recorded", "Tines cut evenly and to the specified length"] },
      { heading: "Coating", items: [`Coating readings (state location: on wire / near weld / panel face): ${blank}`, "No bare spots, runs or blisters; powder coat colour matches the approved sample", "Adhesion check if specified (method: ___)"] },
      { heading: "Packing and marking", items: ["Panels per pallet as agreed; corner protection; strapping", "Labels: order number, panel type, quantity, batch", "Photos of each loaded row; container and seal numbers recorded"] },
      { heading: "Result", items: ["Accept / reject / accept with conditions", `Inspector name, date and signature: ${blank}`] },
    ],
  },
  {
    slug: "anti-climb-358-fence-spec",
    title: "Purchase specification: 358 anti-climb security fencing",
    kind: "specification",
    summary: "A specification for high-security 358 mesh fencing systems, including security rating, fixings, toppings and gates.",
    products: ["anti_climb_358", "gate", "razor_wire"],
    standards: ["LPS 1175", "EN 10223-7", "EN 10244-2", "BS 1722-14"],
    sections: [
      { heading: "1. Security requirement", items: ["Required certified security rating (scheme and level): ___", "Is a rated system required, or 358 mesh to a stated specification only?", "Attack tools and delay time assumed in the risk assessment (from the client): ___"] },
      { heading: "2. System", items: [`Fence height above ground (mm): ${blank}`, "Mesh: 76.2 × 12.7 mm aperture class — state wire diameter and tolerance", "Single or double skin; rail or railless; clamp bar type and fixing centres", "Below-ground anti-dig measures: skirt / concrete plinth / none"] },
      { heading: "3. Toppings and add-ons", items: ["Topping: none / razor wire coil / rotating spikes — dimensions and fixing", "Cranked post extensions: angle and length", "Detection or CCTV mounting provisions"] },
      { heading: "4. Gates", items: ["Gate type, clear opening and rating matched to the fence", "Hinges, drop bolts and locking hardware; anti-lift features", "Automation and access control interface (if any)"] },
      { heading: "5. Finish", items: ["Galvanizing + powder coating system, colour RAL ___", "Touch-up procedure for site damage"] },
      { heading: "6. Evidence", items: ["Certificate of the rated system (scheme, level, listing number, expiry)", "Installer's competence/certification if the rating depends on installation", "Drawings showing every component in the certified configuration"] },
    ],
  },
  {
    slug: "gabion-supply-spec",
    title: "Supply specification: gabion boxes and mattresses",
    kind: "specification",
    summary: "Woven double-twist or welded gabions for retaining walls and erosion control: mesh, wire, coating, lacing and testing.",
    products: ["gabion"],
    standards: ["EN 10223-3", "EN 10223-8", "EN 10244-2", "ASTM A975"],
    sections: [
      { heading: "1. Use", items: ["Retaining wall / slope protection / river training / mattress lining", `Design life (years) and environment (fresh water, sea water, polluted soil): ${blank}`] },
      { heading: "2. Units", items: ["Woven double-twist hexagonal or welded mesh", `Unit sizes (L × W × H, m) and diaphragm spacing: ${blank}`, `Mesh type / aperture and wire diameters (mesh, selvedge, lacing): ${blank}`] },
      { heading: "3. Coating", items: ["Heavy zinc / zinc-aluminium alloy / alloy + polymer coating", "Coating mass and polymer thickness to state; abrasion and UV resistance evidence for polymer"] },
      { heading: "4. Assembly", items: ["Lacing wire or ring fasteners — type, closure strength", "Internal bracing wires per unit", "Stone grading and density (by others) noted on drawings"] },
      { heading: "5. Testing and documents", items: ["Mesh tensile strength and punch test results", "Coating test certificates per batch", "Assembly instructions supplied with delivery"] },
    ],
  },
  {
    slug: "chain-link-fence-spec",
    title: "Purchase specification: chain-link fencing",
    kind: "specification",
    summary: "Chain-link fabric, line wires, posts and fittings for perimeter and sports fencing.",
    products: ["chain_link", "fence_post"],
    standards: ["EN 10223-6", "ASTM A392", "ASTM F1083", "BS 1722-1"],
    sections: [
      { heading: "1. Fabric", items: [`Height (mm), mesh size (mm) and wire diameter (core / overall if coated): ${blank}`, "Selvedge: knuckled / twisted (top and bottom)", "Coating: galvanized before / after weaving, or galvanized + PVC"] },
      { heading: "2. Framework", items: ["Line, corner, end and gate posts — section, wall thickness, length", "Top rail or tension wire; bracing at ends and corners", "Tension bars, bands and caps — material and finish"] },
      { heading: "3. Installation (if included)", items: ["Footing size and concrete grade", "Fabric fixed to posts at stated centres; ground clearance (mm)"] },
      { heading: "4. Documents", items: ["Coating mass certificates", "Drawings and fittings schedule"] },
    ],
  },
  {
    slug: "steel-grating-purchase-spec",
    title: "Purchase specification: steel bar grating",
    kind: "specification",
    summary: "Welded or press-locked steel grating for platforms, walkways and covers: bars, loads, finish, fixings.",
    products: ["steel_grating", "stair_tread", "safety_grating"],
    standards: ["DIN 24537", "BS 4592", "ANSI/NAAMM MBG 531", "EN ISO 1461"],
    sections: [
      { heading: "1. Use and loads", items: ["Pedestrian / light vehicle / heavy vehicle; design load and maximum deflection: ___", `Clear span direction and support width (mm): ${blank}`] },
      { heading: "2. Grating", items: ["Type: welded / press-locked", `Bearing bar size and pitch (mm): ${blank}`, `Cross bar type and pitch (mm): ${blank}`, "Surface: plain / serrated; banding (load / trim)"] },
      { heading: "3. Material and finish", items: ["Steel grade; stainless if specified", "Hot-dip galvanized after fabrication — coating thickness to cite the galvanizing standard"] },
      { heading: "4. Fixings and layout", items: ["Fixing clips: type and number per panel", "Panel layout drawing with cut-outs and toe plates", "Tolerances for panel size and squareness"] },
      { heading: "5. Documents", items: ["Load tables or calculation for the chosen bars and span", "Galvanizing certificate", "Panel marking matching the layout drawing"] },
    ],
  },
  {
    slug: "security-fence-site-acceptance",
    title: "Site acceptance checklist: security fencing",
    kind: "checklist",
    summary: "Walk-the-line checklist for accepting an installed security fence and gates from the contractor.",
    products: ["anti_climb_358", "welded_mesh_panel", "gate"],
    standards: ["LPS 1175"],
    sections: [
      { heading: "Line and level", items: ["Fence follows the approved line; boundary set-out confirmed", "Ground clearance within limit along the whole run; no gaps at changes in level", "Posts plumb; footings to drawing"] },
      { heading: "Mesh and fixings", items: ["Every clamp bar / clip fitted at the stated centres", "Security fixings used where specified; no exposed standard bolts", "No damage to coating; touch-ups done"] },
      { heading: "Toppings and gates", items: ["Topping continuous, correctly fixed at corners and gates", "Gates swing/slide freely; locks and drop bolts work; anti-lift fitted", "Access control tested end to end"] },
      { heading: "Handover", items: ["As-built drawings, certificates and O&M information received", "Spares (panels, fixings, touch-up paint) delivered", `Accepted by, date: ${blank}`] },
    ],
  },
  {
    slug: "coating-thickness-test-record",
    title: "Coating test record: galvanized and powder-coated mesh",
    kind: "record",
    summary: "A record sheet for coating measurements on wire and panels, so results can be compared between batches and suppliers.",
    products: ["welded_mesh_panel", "chain_link", "gabion"],
    standards: ["EN 10244-2", "ISO 2178", "ISO 1460"],
    sections: [
      { heading: "Sample", items: [`Supplier, order, batch: ${blank}`, "Product and wire diameter", "Where measured: wire before fabrication / panel near weld / panel mid-span"] },
      { heading: "Method", items: ["Gravimetric (strip and weigh) / magnetic gauge — instrument and calibration date", "Number of readings per sample and how they are averaged"] },
      { heading: "Readings", items: ["Reading 1 … 10 (g/m² or µm): ___", "Mean, minimum and the specified requirement", "Pass / fail"] },
      { heading: "Sign-off", items: [`Tested by, date: ${blank}`, "Witnessed by (buyer / third party)"] },
    ],
  },
];

export const getTemplate = (slug: string) => TEMPLATES.find((t) => t.slug === slug);
