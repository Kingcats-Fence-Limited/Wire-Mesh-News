import type { Policy } from "./types";

/** Policy texts. All ten are published in full; `draft` marks any policy still structure-only.
 *  Privacy, Terms and the Cookie Policy are drafted conservatively — they name the publisher,
 *  state a legal basis for every use, keep the mandatory consumer and liability carve-outs,
 *  and promise nothing about accuracy that the site cannot keep. */
export const POLICIES: Policy[] = [
  {
    "slug": "editorial-policy",
    "title": "Editorial Policy",
    "inShort": "How we decide what to publish, verify it, label commercial content and correct mistakes.",
    "paras": [
      "Wire Mesh News reports on the wire mesh, welded mesh and metal fabric industry for the people who specify, buy, make and install it. This policy explains how we work.",
      "Independence. Our editorial decisions are made by our editors alone. No advertiser, sponsor, directory listing or commercial relationship buys coverage, influences a story, or changes where anything appears on this site. Our ownership and commercial relationships are disclosed in full on our About page; companies related to our publisher are covered under exactly the same rules and carry a visible relationship label wherever they appear.",
      "Accuracy. We verify facts against primary sources — standards bodies, company filings, named individuals on the record — and we attribute them. Where a figure is an estimate or supplied by a company without independent verification, we say so. Every technical article carries a list of sources.",
      "Fairness. When a story is critical of a named company or person, we ask them for a response before publication and give them reasonable time to reply. Their response, or the fact that they declined, is included.",
      "Fact and opinion. News and analysis are written by our editors and reflect verified facts. Opinion pieces and letters are clearly labelled, carry the author's real name and affiliation, and disclose any interest the author has in the subject. They do not represent the view of Wire Mesh News.",
      "Sponsored content and advertising are always labelled, visually distinct, and never written by our editorial team. See our Advertising & Sponsorship Disclosure.",
      "Corrections. We correct errors promptly and visibly, and we keep a public record. See our Corrections Policy.",
      "Tools. We may use software, including AI tools, to help with research, transcription and first drafts. Every article is written, checked and signed off by a named human editor who is responsible for it. We do not publish machine-generated text as reported work.",
      "Contact the editor: hello@wiremeshnews.com."
    ],
    "sections": [],
    "draft": false
  },
  {
    "slug": "corrections",
    "title": "Corrections Policy",
    "inShort": "What we correct, how we correct it, and how to report an error.",
    "paras": [
      "We get things wrong sometimes. When we do, we fix them in the open.",
      "What we correct. Factual errors of any size — a wrong figure, a misattributed quote, a misnamed company, a standard cited incorrectly. Typos that do not change meaning are fixed silently.",
      "How we correct. The article is updated, and a dated correction note is added to it stating what was wrong and what it now says. We do not delete the original wording from our records. Serious errors are also listed on our Corrections page.",
      "Retractions. If an article's central claim cannot be supported, we withdraw it. The URL returns a notice explaining the withdrawal; it does not disappear quietly.",
      "Right of reply. If you are the subject of an article and believe it is unfair or inaccurate, write to hello@wiremeshnews.com. We will reply within 5 working days and, where justified, publish a correction or your response.",
      "How to report an error: email hello@wiremeshnews.com with the article link, the error, and your source. Reports are logged and reviewed by an editor who did not write the piece."
    ],
    "sections": [],
    "draft": false
  },
  {
    "slug": "comment-policy",
    "title": "Comment Policy",
    "inShort": "Who can comment, what we publish, and how moderation works.",
    "paras": [
      "Comments are open to registered readers with a verified email address. Every comment is reviewed before it appears; expect a delay of up to one working day.",
      "We publish comments that add to the record: a correction, a site experience, a standard we missed, a reasoned disagreement.",
      "We do not publish: sales pitches or contact details; personal attacks; claims about named companies or people that are not supported; plagiarised text; anything unlawful. Company accounts may comment and are labelled as such; they may not promote their own products in comments.",
      "Comments that point out a factual error are prioritised and may trigger a correction. Comments are moderated by editors; decisions are final but you may write to hello@wiremeshnews.com if you think we got it wrong.",
      "Your comment appears only to you while it is in review. We may remove published comments that later prove to breach this policy."
    ],
    "sections": [],
    "draft": false
  },
  {
    "slug": "submission-guidelines",
    "title": "Submission Guidelines",
    "inShort": "What we publish from outside contributors, and how the process works.",
    "paras": [
      "We publish technical articles, case studies, market analysis and letters from people who work in the industry. We do not publish press releases, product promotion or SEO articles.",
      "Who can submit. Anyone with a verified account. Articles must be the author's own original work, not published elsewhere, and free of third-party material you do not have the right to use.",
      "What we look for: a specific problem and a specific answer; real numbers with sources; experience from a site, a plant or a lab; clear statements of what the reader should do differently. Length: 800–2,000 words for articles, 200–400 words for letters.",
      "Disclosure. State your employer and any commercial interest in the subject. Undisclosed interests discovered after publication lead to removal of the article and the account.",
      "Process. Submit through your account. Drafts go to an editor for review; you will see one of five states — draft, pending review, changes requested, rejected, published — and receive an email on each change. Accepted articles are edited for clarity and house style; we send you the edited version before publication.",
      "Rights. You keep copyright. You grant Wire Mesh News a non-exclusive, perpetual licence to publish, edit, translate and distribute the article in any medium. We do not pay for submissions.",
      "After publication. Articles carry your byline, bio and the public contact details you choose to show on your author profile. We may correct or update the article under our Corrections Policy."
    ],
    "sections": [],
    "draft": false
  },
  {
    "slug": "advertising-disclosure",
    "title": "Advertising & Sponsorship Disclosure",
    "inShort": "How sponsored content and advertising are labelled and kept apart from editorial work.",
    "paras": [
      "Wire Mesh News is funded by reader subscriptions, display advertising and sponsored content. This page explains how to tell them apart and what money does and does not buy.",
      "Advertising is labelled ADVERTISEMENT and appears in fixed positions. Advertisers do not know what articles their ads appear next to, and we do not change editorial content for them.",
      "Sponsored content is paid for and supplied by the named company, labelled SPONSORED CONTENT in every list and on the article itself, visually distinct from editorial, and never written by our editorial team. Links in it are marked as sponsored.",
      "Series sponsorship means a company has supported a topic hub financially. The sponsor has no role in choosing or editing the articles in it.",
      "What money cannot buy: a place in the news; a higher position in any list, search result or the Company Directory; a certification badge; removal of a competitor; a softer story. Directory listing is free and ranking is never paid. Where we later offer a paid directory placement it will be in a separate, labelled section that does not change the free listing's order.",
      "Our publisher's own companies and their partners may advertise or sponsor under exactly the same rules, and are labelled with their relationship to us. See About."
    ],
    "sections": [],
    "draft": false
  },
  {
    "slug": "directory-listing-policy",
    "title": "Directory Listing Policy",
    "inShort": "How companies are listed, verified and ordered in the Directory — and what is never for sale.",
    "paras": [
      "The Company Directory lists manufacturers, processors, distributors, laboratories, standards bodies and associations that appear in our reporting or are relevant to it. Listing is free, is decided by our editors, and cannot be bought.",
      "What we show and where it comes from. Each fact on a company profile is labelled: VERIFIED means our editors checked it against a named source on a given date; SELF-REPORTED means the company supplied it and we have not independently confirmed it. Certifications are shown only when the company has provided a copy of the certificate and we have checked it; they are removed automatically on expiry.",
      "Claiming a profile. A company may claim its profile using an email address at its own domain. Claimed companies can maintain their description, product range, photos and contact details; changes are reviewed before they go live. Company type, related coverage and editorial notes remain under our control. Certification details are locked after submission and can only be changed by contacting us.",
      "What we will not publish: capacity, market share or performance figures without a verifiable third-party source; claims about competitors; promotional copy.",
      "Removal and corrections. Write to hello@wiremeshnews.com. We do not remove companies because they dislike our coverage. We correct factual errors under our Corrections Policy.",
      "Related companies. Companies related to our publisher carry a visible relationship label and are listed under the same rules as everyone else."
    ],
    "sections": [],
    "draft": false
  },
  {
    "slug": "copyright",
    "title": "Copyright & Takedown",
    "inShort": "Who owns what on this site, how to reuse it, and how to report an infringement.",
    "paras": [
      "All content on wiremeshnews.com is © Wire Mesh News or its licensors. You may quote short extracts with attribution and a link. You may not republish articles in full, scrape the site, or redistribute market data or company information from it.",
      "Standards. We summarise standards in our own words and link to the issuing bodies. We do not host or distribute standards texts. Buy them from the issuer.",
      "Market data shown on this site is licensed from third parties and may not be copied, redistributed or exported.",
      "If you believe content on this site infringes your copyright, send a notice to hello@wiremeshnews.com containing: the work you own; the URL of the material; your contact details; a statement that you believe in good faith the use is unauthorised; and your signature. We act on valid notices within 5 working days and notify the person who posted the material, who may send a counter-notice."
    ],
    "sections": [],
    "draft": false
  },
  {
    "slug": "privacy",
    "title": "Privacy Policy",
    "inShort": "What personal data we hold, why we hold it, how long we keep it, and the rights you can exercise at any time. We do not sell personal data and we use no advertising networks.",
    "paras": [
      "Wire Mesh News is a trade publication, not an advertising business. We collect as little personal data as a publication can run on, we never sell it, we share it with no advertising network, and nothing optional is stored on your device until you have said yes. This policy explains what we hold, why we hold it, and how to have it changed or deleted.",
      "Who we are. Wire Mesh News is published by KINGCATS FENCE LIMITED, a company incorporated in the Hong Kong Special Administrative Region, which is the controller of the personal data described in this policy. Write to hello@wiremeshnews.com for anything to do with your data; privacy requests sent to that address reach a person, not a queue.",
      "What we collect. When you create an account we collect your email address, the name you choose to display, and a cryptographic hash of your password — we never hold the password itself. If you choose to publish an author profile, whatever you put in it is public because you made it public. When you submit an article, letter or comment, we hold the text, its drafts and the editorial decisions on it. When you use the contact form on a company profile, we pass your message and your email address to that one company. If you subscribe, our payment processor handles the card and we receive only the billing identifier, the plan, the dates and the amount — card numbers never reach our systems. Our servers keep short technical logs of requests, including IP address, for security and fault-finding. Analytics are collected only if you consent, and never identify you individually.",
      "Why we use it, and on what legal basis. We use your account data to run your account and to let you sign in, which is performance of our contract with you. We use submissions, comments and the editorial record to publish and to maintain an accurate, dated publication, which is our legitimate interest as a publisher and, once published, part of the public record. We use billing data to take payment and meet tax and accounting duties, which is contract and legal obligation. We use server logs to keep the site up and to prevent abuse, which is our legitimate interest in security. We use analytics and marketing email only with your consent, which you can withdraw at any time without affecting anything you received before you withdrew it.",
      "Cookies and similar storage. Nothing optional is written to your device before you choose. The detail of what we store, what each item does and how long it lasts is set out in our Cookie Policy, and you can change your choice at any time from the link in the footer.",
      "Who we share it with. We use service providers to run the publication: hosting, email delivery, a payment processor, and — only with your consent — an analytics provider. They act on our instructions and may use your data only to provide that service to us. Separately, when you use a company contact form we pass your message to the single company you chose, and to no one else; we do not resell enquiries, we do not build lead lists, and we do not forward your message to competitors. We may disclose data where the law requires it, and we will tell you unless we are forbidden to. We do not sell personal data, and we share it with no advertising network or data broker.",
      "Where your data is held. We are established in Hong Kong, and our hosting and service providers may process data in countries other than your own, including outside Hong Kong, the European Economic Area and the United Kingdom. Where that happens we rely on an adequacy decision covering the destination country, or on the European Commission's standard contractual clauses together with the UK addendum, and we keep a copy of those safeguards. You can ask us which safeguard applies to a particular provider.",
      "How long we keep it. An account and its private data stay until you delete the account; unverified accounts are removed after five days. Server logs are kept for five months and then deleted. Billing records are kept for as long as tax law requires, which is normally six to ten years depending on the country. Published articles, letters and comments stay as part of the publication and its correction history, because a publication that quietly rewrites its own past is not a reliable one; if you want your name removed from something published, write to us and we will consider it under our Corrections Policy and the law.",
      "Your rights. If you are in the United Kingdom, the European Economic Area or another place with comparable law, you can ask us for a copy of your data, have inaccurate data corrected, have data erased, object to processing we base on legitimate interest, ask us to restrict processing while a dispute is resolved, receive your data in a portable format, and withdraw any consent you gave. Write to hello@wiremeshnews.com. We reply within one month and tell you at once if a request will take longer or if a legal exception prevents us acting on it. We never charge for a reasonable request and we never treat you differently for making one.",
      "California and other US state rights. If you live in a US state with a privacy statute, you may ask what categories of personal information we have collected and from whom, ask for a copy, ask us to delete it, and ask us to correct it. We do not sell personal information and we do not share it for cross-context behavioural advertising, so there is nothing to opt out of; we honour a Global Privacy Control signal as a refusal of all optional storage regardless. Exercising any of these rights never changes the service you receive or the price you pay. Use the same address: hello@wiremeshnews.com.",
      "Children. This site is written for people doing a job and is not directed at children. We do not knowingly create accounts for anyone under 16. If we learn that an account belongs to a child we close it and delete the data.",
      "Security. We use encryption in transit, hashed passwords, access controls limited to the people who need them, and regular updates to the software we run. No system is perfectly secure, and we do not pretend otherwise; if a breach affects your rights we will notify you and the relevant supervisory authority within the time the law allows.",
      "Changes to this policy. If we change anything that affects you we will update the date at the top, note what changed, and — where the change is material — ask for your consent again rather than assume it. The current version is always the one on this page.",
      "How to complain. Tell us first at hello@wiremeshnews.com and we will try to put it right. You also have the right to complain to the data protection authority in your country — in the United Kingdom the Information Commissioner's Office, and in the European Economic Area the supervisory authority of the member state where you live or work."
    ],
    "sections": [],
    "draft": false,
    "updated": "13 October 2026"
  },
  {
    "slug": "terms",
    "title": "Terms of Use",
    "inShort": "The rules for using this site and your account, what we do and do not promise about the information we publish, and the limits of our liability.",
    "paras": [
      "Wire Mesh News is an independent trade publication. These terms are the agreement between you and the company that publishes it. By using the site, creating an account or buying a subscription you accept them. If you do not accept them, please do not use the site.",
      "Who you are contracting with. The site is published by KINGCATS FENCE LIMITED, a company incorporated in the Hong Kong Special Administrative Region. In these terms \"we\" and \"us\" mean that company, and \"you\" means the person using the site. You can reach us at hello@wiremeshnews.com.",
      "Accounts. An account belongs to one person. You must give a working email address, keep your password to yourself, and tell us promptly if you think someone else has used your account. You are responsible for what is done through your account. Do not create an account for someone else, share one, or use a false identity to post as though you were an independent voice when you are not.",
      "Acceptable use. You may read, search, quote briefly with attribution, and link to anything here. You may not scrape the site, download it in bulk, access it by automated means other than a search engine crawler obeying our robots file, redistribute our articles or directory data, resell access, use any of it to train a machine-learning model, or work around a paywall or rate limit. You may not post anything unlawful, defamatory, harassing, infringing or deliberately misleading, and you may not use the contact form to send marketing, to send anything unsolicited in bulk, or to pursue a transaction that sanctions or export-control law forbids.",
      "Content you post. You keep the copyright in what you write. By posting an article, letter, comment or company description you grant us a non-exclusive, worldwide, royalty-free, perpetual licence to publish, edit, translate, store and distribute it in connection with the publication, and you confirm that it is your own work, that you are entitled to grant that licence, and that publishing it will not infringe anyone's rights or breach a duty of confidence you owe. We may edit for clarity and house style, decline to publish, or remove material that breaches these terms or our Comment Policy.",
      "Company profiles and the Directory. Profiles are built from our own reporting and from information companies give us. Each fact carries a label saying whether our editors verified it against a named source or whether the company reported it and we did not confirm it. We take reasonable care, but we do not warrant that any profile is complete, current or correct, and a listing is not an endorsement, a recommendation or a certification. A company may claim its profile and maintain parts of it; we may refuse, amend or withdraw a claim, and we may remove a listing at any time. Do not use the Directory as your due diligence.",
      "Contacting a company through this site. When you send a message through a company profile we pass it to that company and nothing more. We are not an agent, broker or intermediary, we take no fee and no commission, we are not a party to anything you go on to agree, and we do not guarantee that anyone will reply. Any contract, payment, inspection, shipment or dispute is between you and that company alone.",
      "Standards summaries. Our standards pages record a standard's number, title, publisher, edition and status, and describe its scope in our own words. They are not the standard, they do not reproduce its clauses, tables, dimensions or test values, and they are no substitute for buying and reading the current official text from the issuing body. Specify and build from the official text, not from us. Status can change between our checks, and the date we last checked is shown on every entry.",
      "Market data and prices. Prices, indices and freight figures on this site are indicative, usually delayed, and licensed to us by third parties. They are not an offer, a quotation, an invitation to trade or a valuation, they may be wrong or out of date, and they must not be copied, redistributed or exported. Do not price a contract from them.",
      "No professional advice. Nothing on this site is engineering, legal, financial, tax or safety advice, and nothing here is tailored to your project. Design, material selection, corrosion protection, load capacity and compliance are decisions for a qualified professional working from the official standards and the conditions on your site.",
      "Subscriptions and payment. Prices and billing periods are shown before you buy and include tax where we are required to charge it. Paid subscriptions renew automatically at the end of each period until you cancel, and we email you before a renewal where the law requires notice. You can cancel at any time from your account; cancellation stops the next renewal and you keep access until the end of the period you have paid for. If you are a consumer in the United Kingdom or the European Union you have fourteen days to withdraw from a new subscription; if you asked for access to start immediately, you may be charged for the part you used before withdrawing. Nothing here affects a refund right the law gives you.",
      "Advertising and sponsorship. Advertising and sponsored content are bought under a separate agreement with us and are always labelled. Buying them does not buy coverage, position in any list, a certification badge or the removal of a competitor. Our Advertising and Sponsorship Disclosure explains the rules, and it binds us as much as it binds advertisers.",
      "Links to other sites. We link to standards bodies, companies and other publications. We do not control those sites, we are not responsible for what is on them, and a link is not an endorsement.",
      "Availability of the site. We try to keep the site up and accurate, but we do not promise that it will be uninterrupted or error-free. We may change, suspend or withdraw any part of it, including sections, features and data feeds, and we may do so without notice where we need to act quickly for security or legal reasons.",
      "Limits on our liability. Nothing in these terms limits our liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, or for anything else that the law does not allow us to limit — including, if you are a consumer, your statutory rights, which these terms do not affect. Subject to that, and to the fullest extent the law permits, the site and everything on it are provided as they are, we exclude all implied warranties, and we are not liable for loss of profit, loss of business, loss of contracts, loss of anticipated savings, loss of or corruption of data, or any indirect or consequential loss, however it arises. Subject to the same, our total liability to you for all claims arising in any twelve-month period is limited to the amount you paid us in that period, or one hundred US dollars if you paid us nothing.",
      "Your liability to us. If you post something that breaches these terms and it costs us money — a third-party claim, a takedown, legal costs reasonably incurred — you agree to cover that cost, so far as it results from what you did. This does not apply to anything you are not responsible for, and we will tell you promptly about any claim we intend to pass on.",
      "Suspension and closure of accounts. We may suspend or close an account that breaches these terms, that is used to scrape or spam, or that we are legally required to close. Where it is reasonable to do so we tell you why and give you a chance to put it right first. You may close your account at any time from your account settings.",
      "Changes to these terms. We may change these terms. If a change materially affects your rights we will tell you before it takes effect and, for subscribers, give you the chance to cancel without penalty. Continuing to use the site after a change takes effect means you accept it.",
      "Governing law and where disputes are heard. These terms, and any dispute arising out of or in connection with them, are governed by the law of the Hong Kong Special Administrative Region, and the courts of Hong Kong have non-exclusive jurisdiction over them. If you are a consumer, this does not take away the protection of the mandatory consumer law of the country you live in, and you keep the right to bring proceedings in the courts of that country.",
      "Severability and waiver. If a court finds any part of these terms unenforceable, that part is removed and the rest continues to apply. If we do not enforce something straight away, we do not lose the right to enforce it later."
    ],
    "sections": [],
    "draft": false,
    "updated": "13 October 2026"
  },
  {
    "slug": "cookie-policy",
    "title": "Cookie Policy",
    "inShort": "Exactly what this site stores on your device, what each item does, how long it lasts, and how to change your mind at any time. Nothing optional is stored before you choose.",
    "paras": [
      "Wire Mesh News sets nothing optional on your device until you have chosen. There is no pre-ticked box, no “reject” hidden behind an extra click, and no analytics, advertising or tracking running while the banner is still on screen. Accept and Reject sit side by side, the same size and the same weight.",
      "What this policy covers. Cookies are small files a site stores in your browser. Browsers also offer local storage, which works in much the same way. This policy covers both, and we use the word “storage” for the two together. It applies to wiremeshnews.com and to nothing else.",
      "Strictly necessary storage. This is the only category that runs without your consent, because the site cannot work without it. It is three things: a record of the cookie choice you made, so we do not ask again on every page; your light or dark display preference, if you set one; and, if you sign in, a session identifier that keeps you signed in and a security token that stops a third-party site from acting as you. All three stay on your device, none of them follows you to other sites, and none of them is used to build a profile of you. Your choice and your display preference are kept in your browser's local storage until you clear it or change the setting; the sign-in session ends when you sign out or when it expires.",
      "Analytics. With your consent we count page views and referrers so we can see which articles get read and where readers stop. It is aggregate and we do not use it to identify a person, match you across devices, or sell anything to you. If you refuse, nothing analytic is loaded at all — we do not fall back to a “cookieless” tracker instead.",
      "Embedded media. A few articles embed video or a map hosted by a third party. If you refuse this category we show a placeholder with a button instead, and nothing connects to the third party until you press it. If you accept, that provider may set its own storage under its own policy, and we link to that policy at the point of embedding.",
      "Advertising measurement. This category is empty. We do no cross-site tracking, no behavioural targeting and no retargeting, we use no advertising network, and we never share data with a data broker. The switch is listed in the preferences panel anyway, so that it can never be turned on quietly.",
      "How to change your choice. Use the “Cookie settings” link in the footer of any page. The panel opens with your current choice shown; change a switch and save, or reject everything in one click. The change takes effect at once and does not require an account.",
      "How long your choice lasts. Twelve months. After that we ask again. We also ask again if we add a category or materially change what an existing one does, and we never treat silence or continued browsing as consent.",
      "Global Privacy Control. If your browser or extension sends a Global Privacy Control signal, we read it as a refusal of everything optional and we do not show the banner. You can still open the panel from the footer and make a different choice if you want to.",
      "Controlling storage in your browser. Every major browser lets you see, block and delete cookies and local storage, usually under Settings, then Privacy. Blocking strictly necessary storage will stop you signing in and will make us ask about cookies on every page, because the record of your answer is itself one of the things you blocked.",
      "Changes to this policy. If we add or change a category we will update this page, note the date, and ask for your consent again before the new category runs."
    ],
    "sections": [],
    "draft": false,
    "updated": "13 October 2026"
  }
];

export const getPolicy = (slug: string) => POLICIES.find((p) => p.slug === slug);
