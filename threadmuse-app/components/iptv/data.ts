export const iptvBrand = {
  name: "AstraView",
  shortName: "AV",
  tagline: "Luxury IPTV for every screen.",
  email: "hello@astraview.tv",
  phone: "+1 (888) 410-7782",
} as const;

export const navItems = [
  { label: "Experience", href: "#experience" },
  { label: "Devices", href: "#devices" },
  { label: "Compare", href: "#compare" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const counters = [
  { value: "25,000+", label: "Channels", detail: "Live global entertainment" },
  { value: "120,000+", label: "VOD", detail: "Movies, series, replays" },
  { value: "99.9%", label: "Uptime", detail: "Stability-first routing" },
  { value: "4K UHD", label: "Quality", detail: "Crisp premium sources" },
] as const;

export const heroChannels = [
  { title: "Elite Sports", status: "Live 4K", progress: "86%" },
  { title: "Cinema Premieres", status: "HDR", progress: "72%" },
  { title: "Global News", status: "24/7", progress: "93%" },
  { title: "Family Hub", status: "HD", progress: "64%" },
] as const;

export const trustBadges = [
  "Encrypted checkout",
  "Instant activation",
  "Priority setup support",
  "No cable contract",
] as const;

export const socialProof = [
  { value: "18K+", label: "households activated" },
  { value: "4.9/5", label: "average support rating" },
  { value: "<5 min", label: "typical setup time" },
] as const;

export const premiumSignals = [
  { label: "UHD-first routing", detail: "Prioritizes crisp 4K-ready sources when available" },
  { label: "Concierge delivery", detail: "Setup instructions matched to your first device" },
  { label: "Multi-screen ready", detail: "Designed for living room, mobile, tablet, and travel" },
  {
    label: "Cable-free control",
    detail: "Flexible access without rental boxes or technician visits",
  },
] as const;

export const features = [
  {
    title: "Concierge setup",
    description:
      "Device-specific onboarding helps you activate Smart TVs, boxes, phones, tablets, and laptops without guesswork.",
    icon: "headphones",
  },
  {
    title: "Premium route intelligence",
    description:
      "Curated sources, backup routes, and smart playlist organization are tuned for consistent peak-time viewing.",
    icon: "route",
  },
  {
    title: "Cinematic VOD library",
    description:
      "Discover movies, full seasons, replays, and multilingual categories in a polished on-demand experience.",
    icon: "clapperboard",
  },
  {
    title: "Sports-first navigation",
    description:
      "Jump from live matches to event channels, regional coverage, and replays with fewer taps.",
    icon: "trophy",
  },
] as const;

export const streamingIllustrations = [
  {
    title: "Championship Night",
    meta: "Sports - Live 4K",
    gradient: "from-cyan-300 via-blue-500 to-violet-700",
  },
  {
    title: "Midnight Orbit",
    meta: "Sci-fi - HDR",
    gradient: "from-fuchsia-400 via-purple-600 to-indigo-800",
  },
  {
    title: "Coastal Mystery",
    meta: "Series - 8 episodes",
    gradient: "from-emerald-300 via-teal-500 to-slate-800",
  },
  {
    title: "Golden Hour",
    meta: "Cinema - UHD",
    gradient: "from-amber-300 via-orange-500 to-rose-700",
  },
] as const;

export const devices = [
  { label: "Smart TV", detail: "Samsung, LG, Android TV", icon: "tv" },
  { label: "Streaming box", detail: "Google TV, Fire TV, MAG", icon: "box" },
  { label: "Mobile", detail: "iPhone, iPad, Android", icon: "mobile" },
  { label: "Laptop", detail: "Windows, macOS, browser", icon: "laptop" },
  { label: "Tablet", detail: "Second-screen viewing", icon: "tablet" },
  { label: "Projector", detail: "Home cinema setups", icon: "projector" },
] as const;

export const comparisonRows = [
  {
    feature: "Content variety",
    astraView: "25,000+ channels plus 120,000+ VOD titles",
    cable: "Limited bundles with paid add-ons",
  },
  {
    feature: "Device freedom",
    astraView: "Smart TV, mobile, tablet, laptop, and streaming boxes",
    cable: "Usually tied to one box or provider app",
  },
  {
    feature: "Setup speed",
    astraView: "Guided activation in minutes",
    cable: "Install windows, rentals, and hardware returns",
  },
  {
    feature: "Viewing quality",
    astraView: "HD, FHD, 4K UHD, and backup sources",
    cable: "Quality varies by package and equipment",
  },
  {
    feature: "Commitment",
    astraView: "Flexible IPTV plans with no cable contract",
    cable: "Long agreements and cancellation friction",
  },
] as const;

export const plans = [
  {
    name: "Essentials",
    eyebrow: "Premium starter",
    price: "$15",
    term: "1 month",
    description: "A polished entry plan for testing AstraView on your main screen.",
    features: [
      "25,000+ live channels",
      "120,000+ VOD catalog",
      "HD and FHD sources",
      "One household connection",
      "Guided setup support",
    ],
    cta: "Start Essentials",
    popular: false,
  },
  {
    name: "Signature",
    eyebrow: "Most selected",
    price: "$79",
    term: "12 months",
    description: "The flagship plan for year-round sports, premieres, and 4K entertainment.",
    features: [
      "Everything in Essentials",
      "4K UHD priority sources",
      "Backup stream routes",
      "Priority concierge support",
      "Free player recommendations",
      "Seasonal channel refreshes",
    ],
    cta: "Choose Signature",
    popular: true,
  },
  {
    name: "Prestige",
    eyebrow: "Flexible value",
    price: "$45",
    term: "6 months",
    description: "A balanced premium plan for regular viewing without a long contract.",
    features: [
      "25,000+ live channels",
      "Full VOD access",
      "HD, FHD, and select 4K",
      "Anti-freeze routing",
      "Support by chat",
    ],
    cta: "Go Prestige",
    popular: false,
  },
] as const;

export const steps = [
  {
    number: "01",
    title: "Select your plan",
    description:
      "Choose a monthly, semiannual, or annual package based on your screens and viewing habits.",
  },
  {
    number: "02",
    title: "Activate securely",
    description:
      "Receive your login, recommended player, and device-specific instructions after checkout.",
  },
  {
    number: "03",
    title: "Stream in minutes",
    description:
      "Open your player, sign in, and enjoy live TV, sports, movies, and series instantly.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "The dashboard feels premium and the setup guide was clearer than any IPTV service I have used. My Smart TV was live in minutes.",
    name: "Maya R.",
    role: "Home cinema viewer",
  },
  {
    quote:
      "I bought it for live sports. The backup links and event categories made the big match feel much more reliable than cable.",
    name: "Elias T.",
    role: "Weekend sports fan",
  },
  {
    quote:
      "Picture quality is crisp, the movie catalog is huge, and support helped me switch from a TV box to my tablet without drama.",
    name: "Nora K.",
    role: "Multi-device household",
  },
  {
    quote:
      "The annual plan replaced several subscriptions for my family. The interface recommendations alone were worth it.",
    name: "Jonas V.",
    role: "Family entertainment buyer",
  },
] as const;

export const faqs = [
  {
    question: "Is AstraView compatible with my device?",
    answer:
      "Yes. AstraView supports popular IPTV players on Smart TVs, Android TV, Google TV, Fire TV, MAG boxes, iOS, Android, Windows, macOS, and tablets.",
  },
  {
    question: "How fast is activation?",
    answer:
      "Most customers can start in under five minutes after receiving their login, playlist details, and device-specific setup guide.",
  },
  {
    question: "Do plans include movies and live sports?",
    answer:
      "Yes. Every plan includes live channels, sports categories, movie collections, series, replays, and multilingual VOD sections.",
  },
  {
    question: "What makes this different from cable?",
    answer:
      "AstraView is built for device freedom, flexible plans, a larger global catalog, faster activation, and no rental cable box.",
  },
  {
    question: "Is support included?",
    answer:
      "Yes. All plans include setup guidance, and the Signature annual plan includes priority concierge support for device changes.",
  },
] as const;

export const footerLinks = [
  {
    heading: "Platform",
    links: [
      { label: "Experience", href: "#experience" },
      { label: "Devices", href: "#devices" },
      { label: "Compare", href: "#compare" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Setup help", href: "#contact" },
      { label: "FAQ", href: "#faq" },
      { label: "Compatibility", href: "#devices" },
      { label: "Contact", href: `mailto:${iptvBrand.email}` },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "#top" },
      { label: "Privacy", href: "#top" },
      { label: "Refund policy", href: "#top" },
      { label: "Acceptable use", href: "#top" },
    ],
  },
] as const;

export const paymentMethods = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"] as const;

export const trustIndicators = [
  "SSL-secured checkout",
  "Private account delivery",
  "Setup guidance included",
  "Premium routing stack",
] as const;
