import { IMAGES } from "@/lib/images";

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Our Partners", href: "#partners" },
  { label: "News", href: "#news" },
  { label: "Contact", href: "#contact", modal: true as const },
] as const;

export type ServiceIcon =
  | "truck"
  | "shield"
  | "file-text"
  | "clipboard-check"
  | "headphones"
  | "calculator"
  | "users";

export type Service = {
  title: string;
  description: string;
  icon: ServiceIcon;
  image: string;
};

export const SERVICES: Service[] = [
  {
    title: "ELD Service",
    description:
      "Electronic logging device setup, monitoring, and DOT compliance support.",
    icon: "truck",
    image: IMAGES.warehouse,
  },
  {
    title: "Safety",
    description:
      "Proactive safety programs, audits, and documentation for your authority.",
    icon: "shield",
    image: IMAGES.truckHighway,
  },
  {
    title: "IFTA Reporting",
    description:
      "Accurate fuel tax reporting and quarterly filings across jurisdictions.",
    icon: "file-text",
    image: IMAGES.documents,
  },
  {
    title: "MC Setup",
    description:
      "USDOT, MC numbers, insurance guidance, and authority filing support.",
    icon: "clipboard-check",
    image: IMAGES.truckRoad,
  },
  {
    title: "Dispatch",
    description:
      "24/7 professional dispatching to maximize loads, routes, and revenue.",
    icon: "headphones",
    image: IMAGES.truckHighway,
  },
  {
    title: "Accounting",
    description:
      "Trucking-focused bookkeeping, invoicing, and financial reporting.",
    icon: "calculator",
    image: IMAGES.accounting,
  },
  {
    title: "Driver Hiring",
    description:
      "Recruitment, screening, and onboarding for reliable driver teams.",
    icon: "users",
    image: IMAGES.driver,
  },
];

export const ABOUT_STATS = [
  { value: 300, suffix: "+", label: "MC Customers" },
  { value: 1000, suffix: "+", label: "Number of Companies" },
  { value: 3000, suffix: "+", label: "Active Trucks" },
  { value: 7, suffix: "+", label: "Years of Experience" },
] as const;

export const COMPARISON_ROWS = [
  {
    feature: "Safety",
    competitors: "HOS Violations and Fines Inconsistent",
    ours: "Improved Safety Scores",
  },
  {
    feature: "Communication",
    competitors: "Unable to contact",
    ours: "24/7 Expert Support",
  },
  {
    feature: "Monitoring",
    competitors: "Inefficient Vehicle Monitoring",
    ours: "Real-Time Tracking and Monitoring",
  },
  {
    feature: "Load Rate",
    competitors: "Cheap Load Rate",
    ours: "High-Paying Loads",
  },
] as const;

export const FEATURE_COLUMNS = [
  {
    title: "Features",
    items: [
      "24/7 Dispatch Support",
      "Real-time Load Tracking",
      "Dedicated Account Manager",
      "Multi-state Operations",
      "Owner-Operator Programs",
      "Fleet Scaling Solutions",
    ],
  },
  {
    title: "Compliance",
    items: [
      "DOT Safety Compliance",
      "ELD Integration & Monitoring",
      "IFTA Fuel Tax Reporting",
      "MC Authority Management",
      "Insurance Coordination",
      "Audit-Ready Documentation",
    ],
  },
  {
    title: "Service List",
    items: [
      "ELD Service",
      "Safety Programs",
      "IFTA Reporting",
      "MC Setup & Renewal",
      "Dispatch Services",
      "Accounting & Payroll",
      "Driver Recruitment",
    ],
  },
] as const;

export const ELD_PROVIDERS = [
  {
    name: "Safe Lane ELD",
    logo: "/partners/safe-lane-eld.svg",
    url: "https://safelaneeld.com/",
  },
  {
    name: "TT ELD",
    logo: "/partners/tt-eld.png",
    url: "https://www.tteld.com/",
  },
  {
    name: "Legacy ELD",
    logo: "/partners/legacy-eld.png",
    url: "https://www.legacyeld.com/",
  },
  {
    name: "Orient ELD",
    logo: "/partners/orient-eld.png",
    url: "https://www.orienteld.com/",
  },
  {
    name: "Samsara",
    logo: "/partners/samsara-logo.svg",
    url: "https://www.samsara.com/",
  },
  {
    name: "EVO ELD",
    logo: "/partners/evo-eld.png",
    url: "https://evoeld.com/",
  },
  {
    name: "Ez Logs",
    logo: "/partners/ez-logs.svg",
    url: "https://ezlogz.com/",
  },
  {
    name: "Factor ELD",
    logo: "/partners/factor-eld.png",
    url: "https://factoreld.com/",
  },
  {
    name: "Top Compliance ELD",
    logo: "/partners/top-compliance-eld.png",
    url: "https://topceld.com/",
  },
] as const;

export const TRUSTED_COMPANIES = [
  "3PL Global group INC",
  "A & A XPRESS, INc",
  "ADM BROTHERS TRUCKING",
  "Al basrah transportation llc",
  "American Abkisow Transportation LLC",
  "Anmar trucking inc",
  "Babcoo Logistic LLC",
  "BHD LOGISTICS LLC",
  "Black panther",
  "CAPE LOGISTICS LLC",
  "CAPITAL S TRANSPORT LLC",
  "Deer trucking corp",
  "Double ST Trucking Inc",
  "EXCHANGE EXPRESS LLC",
  "EZ TRANSPORTLLC",
  "Fast man truck llc",
  "FRIENDS TRUCKING",
  "FULL VOLTAGE ENTERPRISE LLC",
  "Gakumba LLC",
  "God with us trucking LLC",
  "Gold Standard Delivery LLC",
  "Golden Eagle One Trucking llc",
  "Gooley Transportation LLC",
  "Heemo Transportation LLC",
  "HOLY CROWN EXPRESS INC",
  "Horn Trucking llc",
  "JDE logistic Inc",
  "Jtc Inc",
  "KMG Trans INC",
  "Leading star trucking llc",
  "Leen Trans LLC",
  "LPN TRANSPORTATION LLC",
  "Neal lgx llc",
  "Nizar flex trucking llc",
  "Noor Transport LLC",
  "OLDON TRUCKING LLC",
  "Popular transportation llc",
  "Qandal Beach Trucking LLC",
  "Raihanlogisticsllc",
  "Rana Logistics LLC",
  "RAY LOGISTICS LIC",
  "Rayan in TRUCKING LLC",
  "RIVER OF LOFE TRANSPORTATION LLC",
  "RMS Cargo Inc",
  "Royal express trucking llc",
  "s&y auto transport llc",
  "Safi Express LLC",
  "Saj Fast Trucking llc",
  "Sams transport llc",
  "SAUSSI TRUCKING INC",
  "Sellers Transport Services",
  "Silverbelt Transport LLC",
  "Solorob Transportation",
  "SOUSSI TRUCKING INC",
  "SRJ Express LLC",
  "Three friends express INC",
  "TMI TRANSIT LLC",
  "Unbreakable Enterprises",
  "USA MIDWEST EXPRESS LLC",
  "VIPI LOGISTICS LLC",
  "West Twon Express INC",
  "Yassin Transportation LLC",
  "ZEEZ LOGISTICS LLC",
] as const;

export const TESTIMONIALS = [
  {
    name: "Marcus Johnson",
    role: "Owner-Operator",
    company: "Johnson Freight LLC",
    quote:
      "TOP ELD SOLUTIONS transformed how we handle compliance. Their ELD and IFTA support saved us countless hours and kept us audit-ready.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Fleet Manager",
    company: "Midwest Haulers Inc.",
    quote:
      "The dispatch team is exceptional — professional, responsive, and they genuinely understand the trucking business.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "CEO",
    company: "Chen Logistics Group",
    quote:
      "From MC setup to accounting, TOP ELD SOLUTIONS is our one-stop partner. Premium service at a fraction of in-house cost.",
    rating: 5,
  },
  {
    name: "Angela Torres",
    role: "Operations Director",
    company: "Torres Transport Co.",
    quote:
      "24/7 support isn't marketing fluff here — they answer at 2 AM when we need them. That's why we've stayed for 4 years.",
    rating: 5,
  },
] as const;

export const BLOG_POSTS = [
  {
    slug: "2025-dot-compliance-checklist-for-carriers",
    title: "2025 DOT Compliance Checklist for Carriers",
    excerpt:
      "Essential steps every motor carrier must take to stay audit-ready this year.",
    date: "Mar 12, 2025",
    image: IMAGES.blog1,
    body: [
      "Staying DOT-compliant in 2025 requires more than an ELD and a logbook. Carriers face tighter audits, updated safety ratings, and stricter enforcement of hours-of-service and vehicle maintenance rules.",
      "Start with your authority paperwork: USDOT and MC numbers must be active, insurance filings current, and your MCS-150 updated within the required window. Outdated registrations are one of the fastest ways to trigger a roadside inspection.",
      "Next, verify your ELD provider is on FMCSA's registered device list and that every driver knows how to transfer logs during an inspection. Audit your last 6 months of records for form and manner errors, unidentified driving time, and missing supporting documents.",
      "Vehicle maintenance files should include pre-trip inspection records, annual inspections, and repair documentation. Safety policies — drug and alcohol, accident reporting, and driver qualification — must be signed and on file for every active driver.",
      "TOP ELD Solutions helps carriers run compliance reviews, correct log violations, and prepare for DOT audits before problems become out-of-service orders or authority revocations.",
    ],
  },
  {
    slug: "how-outsourcing-dispatch-increases-revenue",
    title: "How Outsourcing Dispatch Increases Revenue",
    excerpt:
      "Why owner-operators are turning to professional dispatch partners.",
    date: "Feb 28, 2025",
    image: IMAGES.blog2,
    body: [
      "Owner-operators and small fleets often lose revenue not because of freight rates, but because of downtime spent searching loads, negotiating brokers, and handling paperwork instead of driving.",
      "Professional dispatch teams monitor multiple load boards, build broker relationships, and book lanes that match your equipment and home time preferences. That means fewer empty miles and more consistent weekly revenue.",
      "A good dispatch partner also tracks rate confirmations, detention, and lumper receipts so you get paid correctly. They handle check calls and updates so you can focus on safe, compliant driving.",
      "Outsourcing dispatch reduces the cost of hiring in-house staff while giving you access to experienced negotiators who understand market trends across regions and seasons.",
      "Carriers working with TOP ELD Solutions combine dispatch support with safety and compliance services — keeping loads moving while protecting your authority and CSA scores.",
    ],
  },
  {
    slug: "ifta-reporting-common-mistakes-to-avoid",
    title: "IFTA Reporting: Common Mistakes to Avoid",
    excerpt:
      "Protect your authority with accurate quarterly fuel tax filings.",
    date: "Feb 14, 2025",
    image: IMAGES.blog3,
    body: [
      "IFTA reporting errors can lead to penalties, audits, and delayed renewals. Most mistakes come from incomplete mileage records, wrong fuel receipt data, or missing trips across member jurisdictions.",
      "Every qualified vehicle must track total miles and fuel purchased in each IFTA jurisdiction — not just your home state. Relying on estimates instead of actual odometer and fuel entries is a common audit trigger.",
      "Keep fuel receipts with date, gallons, state, and vehicle ID. If you use fuel cards, reconcile card reports with your mileage logs quarterly rather than scrambling at filing time.",
      "Trips under 100 miles or personal conveyance still need clear documentation. Gaps in your records force auditors to assume the worst-case tax liability.",
      "TOP ELD Solutions offers IFTA reporting support that ties ELD mileage to fuel data, helping you file accurately and avoid costly amendments or jurisdiction penalties.",
    ],
  },
] as const;

export const FOOTER_LINKS = {
  services: [
    "ELD Service",
    "Safety Compliance",
    "IFTA Reporting",
    "MC Setup",
    "Dispatch",
    "Accounting",
    "Driver Hiring",
  ],
  products: [
    "Fleet Management",
    "Compliance Suite",
    "Dispatch Platform",
    "Accounting Tools",
  ],
  support: [
    "Contact Us",
    "Help Center",
    "Documentation",
    "Privacy Policy",
    "Terms of Service",
  ],
} as const;

export const COMPANY = {
  name: "TOP ELD SOLUTIONS INC",
  shortName: "TOP ELD",
  tagline: "Professional ELD & Trucking Support Services",
  email: "info@topeldsolutions.com",
  phone: "+1 (800) 555-ELD1",
  address: "Dallas, TX · Serving carriers nationwide",
} as const;
