import type { Author, Column, Letter } from "./types";

export const AUTHORS: Author[] = [
  {
    slug: "mei-lin",
    name: "Mei Lin",
    role: "Editor · Technical Guides",
    sections: ["technical_guides", "news", "buying_guides"],
    bio: "Fourteen years in welded-mesh production and quality management before joining the newsroom. Runs the Technical Guides section and writes most of the standards coverage.",
    since: "2026-01",
    basedIn: "Hamburg, Germany",
    email: "mei.lin@wiremeshnews.com",
    linkedin: "https://www.linkedin.com/",
    expertise: ["Specifications & tolerances", "Coatings", "Perimeter security", "Standards"],
  },
  {
    slug: "daniel-obi",
    name: "Daniel Obi",
    role: "Markets editor",
    sections: ["market_insights"],
    bio: "Covered steel and non-ferrous markets for a price-reporting agency for nine years. Writes Market Insights and maintains the market data methodology.",
    since: "2026-01",
    basedIn: "London, United Kingdom",
    email: "daniel.obi@wiremeshnews.com",
    expertise: ["Zinc and coating costs", "Trade policy", "Freight"],
  },
  {
    slug: "hanna-kraus",
    name: "Hanna Kraus",
    role: "Technical contributor",
    sections: ["applications", "technical_guides"],
    bio: "Civil engineer with a background in geotechnical and façade projects. Writes the Applications section from the specifier's side of the table.",
    since: "2026-02",
    basedIn: "Vienna, Austria",
    expertise: ["Gabions", "Façades", "Filtration materials"],
  },
  {
    slug: "tomas-reyes",
    name: "Tomás Reyes",
    role: "Procurement correspondent",
    sections: ["buying_guides", "news"],
    bio: "Ran fencing and site-security procurement for a contractor group for a decade. Writes Buying Guides and reports from trade shows.",
    since: "2026-02",
    basedIn: "Houston, United States",
    expertise: ["RFQs", "Inspection", "Cost comparison"],
  },
];

export const getAuthor = (slug: string) => AUTHORS.find((a) => a.slug === slug);

export const LETTERS: Letter[] = [
  {
    slug: "stop-quoting-galvanised-without-a-number",
    date: "2026-10-08",
    title: "Stop quoting ‘galvanised’ without a number — the word on its own means nothing in a contract.",
    writer: { name: "J. Whitfield", role: "Specifier", org: "Engineering consultancy", country: "United Kingdom", verified: true },
    teaser: "Your guide on balancing diameter, opening and coating is the first I have seen that puts coating second rather than last. But it still lets one habit through.",
    body: [
      "Sir — Your guide on balancing diameter, opening and coating is the first I have seen that puts coating second rather than last. But it still lets one habit through: the word ‘galvanised’ appears in a specification example without a number next to it.",
      "In twenty years of reviewing tender returns I have never once seen that word settle a dispute. A supplier who quotes it has committed to nothing a gauge can check. Every specification I sign now carries the zinc weight, the class, the measurement location and the standard edition. It adds one line and removes a month of argument.",
      "If your readers take one thing from the piece, let it be that line.",
    ],
    replyTo: { slug: "wire-diameter-mesh-opening-coating-balance", title: "Wire diameter, mesh opening, coating: how to balance the three", section: "technical_guides" },
    editorReply: { by: "Mei Lin", date: "2026-10-09", text: "A fair catch. The example specification in section 05 has been updated to state coating by weight, class and measurement location, with a dated note on the article. The point stands and is now in the self-check list." },
    furtherLetters: ["coating-weight-is-a-bath-side-measurement"],
  },
  {
    slug: "the-mill-certificate-said-compliant",
    date: "2026-10-05",
    title: "The mill certificate said compliant. Nobody asked which clause it was compliant with.",
    writer: { name: null, role: "QA engineer", org: "Manufacturer", country: "Türkiye", verified: true },
    teaser: "I work on the side that issues the certificates. Your article is right about what buyers miss; here is what the issuer sees.",
    body: [
      "Sir — I work on the side that issues the certificates your article teaches readers to read. The piece is right about what buyers miss. Here is what the issuer sees.",
      "A certificate says ‘complies with EN 10223-4’. It does not say which clauses were tested, because the buyer did not ask for any. We test what we are asked to test; when nothing is asked, we test what our own system requires, and the certificate honestly reports that.",
      "The fix is on the purchase order, not in our laboratory: name the clauses.",
    ],
    replyTo: { slug: "reading-a-mill-certificate-line-by-line", title: "Reading a mill certificate line by line", section: "buying_guides" },
  },
  {
    slug: "we-re-tendered-after-the-audit",
    date: "2026-09-29",
    title: "We re-tendered after the audit. The cheap panel cost us twice.",
    writer: { name: "A. Nascimento", role: "Buyer", org: "Contractor", country: "Brazil", verified: true },
    teaser: "A first-hand account of the comparison your article describes, with the numbers we were not allowed to publish at the time.",
    body: [
      "Sir — Your cost comparison describes exactly what happened to us last year, so I will add the numbers we were not allowed to publish at the time.",
      "The winning panel was 11% cheaper per metre. The coating failed at eighteen months on the seaward run. The replacement, the second mobilisation and the client's penalty together came to a little over twice the original saving.",
      "We now score coating life in the tender, not just price.",
    ],
    replyTo: { slug: "why-the-cheapest-panel-loses-the-audit", title: "Why the cheapest panel loses the audit", section: "buying_guides" },
    furtherLetters: ["second-letter-on-audit", "third-letter-on-audit"],
  },
  {
    slug: "coating-weight-is-a-bath-side-measurement",
    date: "2026-09-22",
    title: "Coating weight is a bath-side measurement. By the time it reaches site it is a different number.",
    writer: { name: "M. Petrov", role: "Plant engineer", org: "Galvanizer", country: "Bulgaria", verified: true },
    teaser: "On the measurement-location question raised in the airport case study — from the plant floor.",
    body: [
      "Sir — The airport case study touches the question every galvanizer wishes buyers would ask before the order: where will you measure?",
      "Wire is measured leaving the bath. Panels are welded, handled, stacked and shipped. Each step removes zinc at the contact points and none of it is dishonest. Both numbers are true; only one of them is in the contract.",
    ],
    replyTo: { slug: "coating-weight-chain-link-test-report", title: "Coating weight on chain link fabric: reading the test report", section: "technical_guides" },
  },
  {
    slug: "correction-standards-watch-en-10223-4",
    date: "2026-09-15",
    title: "A correction to your Standards Watch item on EN 10223-4: the review is systematic, not a revision.",
    writer: { name: "R. Lindqvist", role: "Standards committee member", org: "National standards body", country: "Sweden", verified: true },
    teaser: "The distinction matters for anyone deciding whether to wait for a new edition before specifying.",
    body: [
      "Sir — Your Standards Watch item of 8 September described EN 10223-4 as ‘under revision’. It is under systematic review, which is a periodic check on whether revision is needed. No drafting has started.",
      "The distinction matters: a specifier reading ‘revision’ may wait for an edition that may never come.",
    ],
    replyTo: { slug: "what-en-10223-4-actually-requires", title: "Standards Watch, 8 September", section: "technical_guides" },
    editorReply: { by: "Mei Lin", date: "2026-09-16", text: "Corrected. The Standards Index entry and the Standards Watch item now read ‘under systematic review’, with a dated correction note. Thank you for the precision." },
    ledToCorrection: true,
  },
  {
    slug: "second-letter-on-audit",
    date: "2026-10-11",
    title: "Scoring coating life in a tender only works if someone can verify the claim.",
    writer: { name: "P. Osei", role: "Procurement manager", org: "Utility", country: "Ghana", verified: true },
    teaser: "A reply to the letter on re-tendering after the audit.",
    body: ["Sir — Mr Nascimento's letter is right about the outcome and optimistic about the remedy. We score coating life too; the problem is the evidence. A third-party test report on the actual lot is the only thing we have found that holds up."],
    replyTo: { slug: "why-the-cheapest-panel-loses-the-audit", title: "Why the cheapest panel loses the audit", section: "buying_guides" },
  },
  {
    slug: "third-letter-on-audit",
    date: "2026-10-12",
    title: "The penalty clause did more for our coating quality than any specification ever did.",
    writer: { name: "L. Haddad", role: "Sales director", org: "Fence manufacturer", country: "United Arab Emirates", verified: true },
    teaser: "From the supplier's side of the same tender dynamic.",
    body: ["Sir — From the other side of the table: a defined penalty for premature coating failure changed our process controls faster than any specification clause. We now test every lot ourselves, because we pay if it fails."],
    replyTo: { slug: "why-the-cheapest-panel-loses-the-audit", title: "Why the cheapest panel loses the audit", section: "buying_guides" },
  },
  {
    slug: "livestock-fence-tension-is-a-soil-question",
    date: "2026-10-01",
    title: "Fence tension is a soil question before it is a wire question.",
    writer: { name: "S. McBride", role: "Fencing contractor", org: "Agricultural contractor", country: "New Zealand", verified: true },
    teaser: "On the livestock fencing guide: the strainer post is where most of the engineering happens.",
    body: ["Sir — Your livestock guide is a good introduction, but the strainer assembly deserves its own article. Most fence failures I am called to are not wire failures; they are a strainer moving in soft ground."],
    replyTo: { slug: "livestock-fencing-knots-and-tensions", title: "Livestock fencing: knot types, tension and the ground that decides both", section: "applications" },
  },
];

export const getLetter = (slug: string) => LETTERS.find((l) => l.slug === slug);
export const lettersFor = (articleSlug: string) => LETTERS.filter((l) => l.replyTo.slug === articleSlug);

export const COLUMNS: Column[] = [
  {
    slug: "nobody-loses-a-tender-on-wire-diameter",
    date: "2026-10-09",
    title: "Nobody loses a tender on wire diameter. They lose the fence on coating.",
    summary: "The industry negotiates on the number that matters least. A plea to move the argument to the number that decides service life.",
    author: { name: "Ingrid Solberg", title: "Head of specification", org: "Nordic infrastructure contractor", disclosure: "The author's employer buys fencing products from several companies listed in the Directory. She holds no shares in any mesh producer." },
    body: ["Every tender I have reviewed this year has had the same argument in the clarification round, and it has been the wrong argument.", "Wire diameter is easy to compare. Coating weight is not, because it needs a method, a location and a laboratory. So the argument goes where comparison is easy, and the fence fails where comparison was hard."],
  },
  {
    slug: "the-standard-is-not-the-specification",
    date: "2026-09-25",
    title: "The standard is not the specification",
    summary: "Citing a standard number is where specification begins, not where it ends.",
    author: { name: "Kwame Asante", title: "Principal engineer", org: "Independent consultancy", disclosure: "The author sits on a national mirror committee for fencing standards. He is not paid by any manufacturer." },
    body: ["A standard describes a family of products and a set of test methods. It does not choose for you. The selection within it — class, grade, tolerance — is the specification, and it is the part most tenders leave blank."],
  },
  {
    slug: "what-a-galvanizer-wishes-buyers-knew",
    date: "2026-09-11",
    title: "What a galvanizer wishes buyers knew before they wrote the order",
    summary: "Five habits that cost buyers money at the coating stage, from someone who runs a bath.",
    author: { name: "Elena Marchetti", title: "Operations director", org: "Hot-dip galvanizing plant", disclosure: "The author's company provides coating services to fence manufacturers, some of which are listed in the Directory." },
    body: ["Buyers write ‘galvanised’ and galvanizers read ‘whatever our system does by default’. Neither side is wrong. Both are about to have an argument."],
  },
];

export const getColumn = (slug: string) => COLUMNS.find((c) => c.slug === slug);
