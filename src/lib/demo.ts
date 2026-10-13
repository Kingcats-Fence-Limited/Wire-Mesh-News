/** Original demo imagery (public/demo, generated in-house — no third-party assets).
 *  Picked by keywords in the seed (slug / title / product name) so the picture matches the subject;
 *  otherwise by a stable hash so each item keeps its picture. */
export const DEMO_COUNT = 16;
const KEY: [RegExp, number][] = [
  [/gabion|rockfall|slope|retaining|mattress|coastal/, 3],
  [/grating|grate|walkway|tread|stair|trench|handrail|platform|load-table/, 4],
  [/chain-?link|cyclone|diamond/, 2],
  [/razor|barbed|anti-?climb|358|prison|high-security|perimeter|security|airport|data-centre|threat/, 14],
  [/rebar|reinforc|concrete|brick|plaster|slab/, 13],
  [/filter|filtration|clean-?room|disc|cartridge|sinter/, 15],
  [/stainless|304|316|woven|cloth|screen|sieve|wedge/, 16],
  [/perforat/, 6],
  [/expanded|fa[cç]ade|cladding|architectur/, 7],
  /* products before topics: a welded-mesh product must not fall through to the factory photo */
  [/mesh|panel|welded|opening|diameter|gauge|tolerance/, 1],
  [/zinc|galvan|coat|powder|wire-rod|wire rod|drawn|coil|smelter|premium/, 8],
  [/container|freight|shipping|export|import|duty|dumping|tariff|232|trade|customs|packing|lead-time/, 11],
  [/price|market|cost|q[1-4]|index|chart|steady|demand|outlook|survey/, 12],
  [/fence|fencing|post|footing|gate|livestock|farm|solar|ball-court|sport|pool|garden/, 9],
  [/machine|plant|commission|factory|flatness|shear|production|manufactur|expo|inspection|certificate|audit|tender/, 10],
];
export function demoIndex(seed: string, offset = 0) {
  const s = seed.toLowerCase();
  if (offset === 0) for (const [re, n] of KEY) if (re.test(s)) return n;
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return ((h + offset) % DEMO_COUNT) + 1;
}
export const demoSrc = (seed: string, offset = 0) => `/demo/wm-${String(demoIndex(seed, offset)).padStart(2, "0")}.jpg`;
export const logoSrc = (slug: string) => `/demo/logo-${slug}.png`;
/** Inline style for a cover-fitted demo photo on any box. */
export const demoBg = (seed: string, offset = 0): React.CSSProperties => ({ backgroundImage: `url(${demoSrc(seed, offset)})`, backgroundSize: "cover", backgroundPosition: "center" });
