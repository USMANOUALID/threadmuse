export const marketingNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const heroStats = [
  { label: "Automated workflows", value: "24M+" },
  { label: "Revenue teams onboarded", value: "1,200+" },
  { label: "Platform uptime", value: "99.98%" },
] as const;

export const partnerLogos = ["STRIPE", "LINEAR", "NOTION", "VERCEL", "OPENAI", "RAMP"];

export const features = [
  {
    eyebrow: "AI orchestration",
    title: "Build revenue systems that learn from every customer signal.",
    description:
      "Connect CRM, product, support, billing, and marketing data into a single AI command layer with human approvals and audit trails.",
  },
  {
    eyebrow: "CMS control",
    title: "Edit high-converting pages without waiting on engineering.",
    description:
      "Homepage modules, services, plans, testimonials, FAQs, blog posts, SEO, and media are managed from the admin dashboard.",
  },
  {
    eyebrow: "Executive analytics",
    title: "Turn board-level questions into live operational views.",
    description:
      "Monitor growth loops, funnel health, activation, retention, pipeline quality, and automated actions in one premium dashboard.",
  },
  {
    eyebrow: "Enterprise security",
    title: "Supabase auth, RLS, and admin roles from day one.",
    description:
      "Role-based access keeps CMS actions, customer messages, media, users, and site settings behind secure admin-only policies.",
  },
] as const;

export const benefits = [
  "Launch a premium SaaS brand in days with production-ready public pages.",
  "Capture contact requests, newsletter leads, and search intent in structured tables.",
  "Centralize every piece of editable content in a professional CMS dashboard.",
  "Ship fast-loading SEO pages with semantic metadata, sitemap, robots, and JSON-LD.",
  "Give admins image uploads, analytics, user management, and settings without code.",
  "Scale safely with Supabase row-level security and role-based admin access.",
] as const;

export const services = [
  {
    slug: "ai-automation",
    title: "AI Automation Systems",
    description:
      "Design, deploy, and monitor AI workflows that qualify leads, summarize accounts, trigger lifecycle campaigns, and route high-value work.",
    deliverables: ["Workflow maps", "Prompt operations", "Human approval queues", "Audit dashboards"],
  },
  {
    slug: "saas-growth-sites",
    title: "Premium SaaS Growth Websites",
    description:
      "Conversion-focused websites with animated sections, pricing, CMS editing, SEO foundations, and launch-ready analytics.",
    deliverables: ["Landing pages", "SEO architecture", "CMS fields", "Performance optimization"],
  },
  {
    slug: "analytics-command-center",
    title: "Analytics Command Centers",
    description:
      "Board-ready dashboards for pipeline, retention, activation, revenue expansion, content performance, and channel ROI.",
    deliverables: ["KPI modeling", "Supabase views", "Role-based reports", "Executive summaries"],
  },
  {
    slug: "cms-ops",
    title: "CMS & Content Operations",
    description:
      "Structured content models for services, pricing, testimonials, FAQs, articles, metadata, media, and global settings.",
    deliverables: ["Content schemas", "Admin workflows", "Media library", "Approval flows"],
  },
] as const;

export const pricingPlans = [
  {
    name: "Launch",
    price: "$149",
    cadence: "/mo",
    description: "For founders and boutique teams launching a premium SaaS presence.",
    features: ["Editable website CMS", "Contact and newsletter storage", "Basic analytics", "1 admin seat"],
    cta: "Start Launch",
  },
  {
    name: "Scale",
    price: "$399",
    cadence: "/mo",
    description: "For teams that need automation, content velocity, and richer reporting.",
    features: ["Everything in Launch", "AI workflow modules", "Advanced SEO settings", "5 admin seats", "Priority support"],
    cta: "Choose Scale",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    description: "For organizations with bespoke data, security, and operating-model requirements.",
    features: ["Custom Supabase architecture", "SAML-ready admin access", "Dedicated success", "Quarterly growth reviews"],
    cta: "Talk to sales",
  },
] as const;

export const testimonials = [
  {
    quote:
      "NoirEdge made our site feel like a category leader and gave our operators a CMS that actually mirrors how the business works.",
    name: "Maya Chen",
    role: "COO, SignalForge",
  },
  {
    quote:
      "The admin dashboard is the rare combination of beautiful and useful. Our team edits content, reviews leads, and tracks campaigns without engineering tickets.",
    name: "Andre Willis",
    role: "VP Growth, Northstar AI",
  },
  {
    quote:
      "We went from static pages to an AI-enabled operating layer with clean data policies, secure roles, and executive-grade analytics.",
    name: "Elena Rossi",
    role: "Founder, ArcPilot",
  },
] as const;

export const faqs = [
  {
    question: "Is the CMS connected to Supabase?",
    answer:
      "Yes. The project includes Supabase tables, storage buckets, RLS policies, admin role checks, contact storage, newsletter leads, and CMS content models.",
  },
  {
    question: "Can non-technical admins edit the website?",
    answer:
      "The dashboard includes management screens for homepage content, services, pricing, testimonials, FAQs, blog posts, media, settings, SEO, users, and analytics.",
  },
  {
    question: "Is this optimized for SEO and performance?",
    answer:
      "Pages use semantic sections, per-page metadata, a static sitemap, robots rules, accessible HTML, font optimization, responsive layouts, and CSS-only motion.",
  },
  {
    question: "How is admin access protected?",
    answer:
      "Supabase Auth handles sessions, the protected admin route validates the signed-in user, and database policies allow CMS writes only for admin roles.",
  },
] as const;

export const blogPosts = [
  {
    slug: "premium-saas-homepage-anatomy",
    title: "The anatomy of a premium SaaS homepage that converts enterprise buyers",
    excerpt:
      "A practical breakdown of hero clarity, trust architecture, objections, proof, pricing, and action paths.",
    category: "Growth",
    readTime: "6 min read",
    date: "May 20, 2026",
  },
  {
    slug: "supabase-cms-rls",
    title: "How to design a Supabase CMS with row-level security and admin roles",
    excerpt:
      "Secure patterns for editable content, public reads, private messages, media libraries, and user management.",
    category: "Engineering",
    readTime: "8 min read",
    date: "May 17, 2026",
  },
  {
    slug: "ai-ops-dashboard",
    title: "What executives actually need from an AI operations dashboard",
    excerpt:
      "The metrics, workflow states, and governance signals that make AI automation safe enough for revenue teams.",
    category: "Analytics",
    readTime: "5 min read",
    date: "May 12, 2026",
  },
] as const;

export const searchIndex = [
  ...features.map((item) => ({ title: item.title, description: item.description, href: "/", type: "Feature" })),
  ...services.map((item) => ({ title: item.title, description: item.description, href: "/services", type: "Service" })),
  ...pricingPlans.map((item) => ({ title: `${item.name} plan`, description: item.description, href: "/pricing", type: "Pricing" })),
  ...blogPosts.map((item) => ({ title: item.title, description: item.excerpt, href: "/blog", type: "Article" })),
] as const;

export const adminSections = {
  homepage: {
    title: "Manage homepage content",
    description: "Edit hero copy, feature modules, benefits, testimonials, FAQ blocks, CTA, and contact section content.",
    fields: ["Hero headline", "Hero subheadline", "CTA label", "Proof metrics", "Featured logo strip", "Contact intro"],
    rows: ["Hero: AI operating system", "Features grid: 4 modules", "CTA: Book a strategy call", "FAQ: 4 questions"],
  },
  services: {
    title: "Manage services",
    description: "Create and reorder agency and SaaS service offerings shown across marketing pages.",
    fields: ["Service title", "Slug", "Description", "Deliverables", "Display order", "Published"],
    rows: services.map((service) => service.title),
  },
  pricing: {
    title: "Manage pricing plans",
    description: "Control plan names, monthly prices, features, badges, CTA copy, and published state.",
    fields: ["Plan name", "Price", "Cadence", "Feature list", "Featured badge", "Checkout URL"],
    rows: pricingPlans.map((plan) => `${plan.name} ${plan.price}`),
  },
  testimonials: {
    title: "Manage testimonials",
    description: "Curate customer proof, roles, companies, featured status, and homepage rotation.",
    fields: ["Quote", "Customer name", "Role", "Company", "Avatar", "Featured"],
    rows: testimonials.map((testimonial) => testimonial.name),
  },
  faq: {
    title: "Manage FAQ",
    description: "Keep buyer objections, implementation answers, security notes, and support copy up to date.",
    fields: ["Question", "Answer", "Category", "Display order", "Published"],
    rows: faqs.map((faq) => faq.question),
  },
  blog: {
    title: "Manage blog posts",
    description: "Draft, publish, schedule, tag, and optimize articles for organic search.",
    fields: ["Title", "Slug", "Excerpt", "Body", "Category", "SEO title", "Status"],
    rows: blogPosts.map((post) => post.title),
  },
  messages: {
    title: "Manage contact messages",
    description: "Review stored form submissions, qualification notes, source attribution, and follow-up status.",
    fields: ["Name", "Email", "Company", "Budget", "Message", "Status"],
    rows: ["New enterprise demo request", "Scale plan implementation question", "Partner inquiry"],
  },
  media: {
    title: "Upload and manage images",
    description: "Upload logos, hero art, blog covers, avatars, OG assets, and reusable CMS media.",
    fields: ["File", "Alt text", "Folder", "Public URL", "Owner", "Usage"],
    rows: ["logo-mark.svg", "hero-dashboard.png", "blog-cover-ai-ops.jpg"],
  },
  settings: {
    title: "Website settings",
    description: "Control brand, contact email, social links, conversion copy, legal metadata, and global scripts.",
    fields: ["Site name", "Support email", "Primary CTA", "Social links", "Tracking IDs", "Maintenance mode"],
    rows: ["Brand: NoirEdge", "Primary CTA: Book strategy call", "Support: hello@noiredge.ai"],
  },
  seo: {
    title: "SEO settings",
    description: "Edit page titles, descriptions, canonical URLs, OG images, robots rules, and structured data.",
    fields: ["Route", "Meta title", "Meta description", "Canonical", "OG image", "Noindex"],
    rows: ["/", "/services", "/pricing", "/blog"],
  },
  analytics: {
    title: "Analytics page",
    description: "Track page views, contact conversions, newsletter growth, plan interest, search queries, and CMS publishing.",
    fields: ["Metric", "Value", "Period", "Trend", "Source"],
    rows: ["Visitors: 84,230", "Conversion rate: 7.8%", "Newsletter leads: 12,480", "Searches: 5,901"],
  },
  users: {
    title: "User management",
    description: "Invite teammates, assign admin roles, audit access, and deactivate users safely.",
    fields: ["Name", "Email", "Role", "Status", "Last active", "MFA"],
    rows: ["Maya Chen - Owner", "Andre Willis - Admin", "Elena Rossi - Editor"],
  },
  newsletter: {
    title: "Newsletter management",
    description: "View subscribers, lead sources, consent timestamps, segments, and campaign readiness.",
    fields: ["Email", "Source", "Segment", "Status", "Subscribed at"],
    rows: ["founder@signalforge.ai", "growth@northstar.ai", "ops@arcpilot.io"],
  },
} as const;

export type AdminSectionKey = keyof typeof adminSections;
