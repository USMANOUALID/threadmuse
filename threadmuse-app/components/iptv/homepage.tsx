import Link from "next/link";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Clapperboard,
  Gamepad2,
  Globe2,
  Headphones,
  Laptop,
  LockKeyhole,
  MonitorPlay,
  Play,
  RadioTower,
  Router,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  TabletSmartphone,
  Tv,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const brand = {
  name: "AstraView",
  short: "AV",
  email: "hello@astraview.tv",
};

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Sports", href: "#sports" },
  { label: "Devices", href: "#devices" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

const stats = [
  { value: "24K+", label: "live channels" },
  { value: "180K+", label: "movies and series" },
  { value: "99.9%", label: "uptime target" },
] as const;

const heroChannels = [
  "Premier sports",
  "Cinema vault",
  "Kids hub",
  "Global news",
  "Documentaries",
  "Lifestyle",
] as const;

const features = [
  {
    title: "Ultra-fast channel switching",
    description:
      "Optimized playlists and smart routing keep your favorite content responsive during peak hours.",
    icon: Zap,
  },
  {
    title: "Expansive global lineup",
    description:
      "Browse live entertainment, news, lifestyle, kids, documentary, and premium international categories.",
    icon: Globe2,
  },
  {
    title: "On-demand library",
    description:
      "A curated catalog of movies, box sets, and fresh releases with clean categories and quick search.",
    icon: Clapperboard,
  },
  {
    title: "Guided setup support",
    description:
      "Clear activation instructions for every device, plus responsive help whenever you need it.",
    icon: Headphones,
  },
] as const;

const sports = [
  "Football",
  "Basketball",
  "Combat sports",
  "Tennis",
  "Motorsport",
  "Golf",
  "Rugby",
  "Cricket",
] as const;

const movieCards = [
  {
    title: "Neon District",
    meta: "Action - 4K",
    gradient: "from-cyan-400 via-blue-500 to-violet-600",
  },
  {
    title: "Deep Meridian",
    meta: "Sci-fi - HDR",
    gradient: "from-fuchsia-500 via-purple-600 to-indigo-700",
  },
  {
    title: "Velvet Case",
    meta: "Drama - Series",
    gradient: "from-amber-300 via-orange-500 to-rose-600",
  },
  {
    title: "North Signal",
    meta: "Thriller - HD",
    gradient: "from-emerald-300 via-teal-500 to-cyan-700",
  },
] as const;

const devices = [
  { label: "Smart TV", detail: "Samsung, LG, Android TV", icon: Tv },
  { label: "Streaming boxes", detail: "Google TV, Fire TV, MAG", icon: MonitorPlay },
  { label: "Mobile", detail: "iPhone, iPad, Android", icon: TabletSmartphone },
  { label: "Computer", detail: "Windows, macOS, browser", icon: Laptop },
  { label: "Tablet", detail: "Watch around the house", icon: Smartphone },
  { label: "Consoles", detail: "Big-screen media apps", icon: Gamepad2 },
] as const;

const plans = [
  {
    name: "Starter",
    eyebrow: "Try the full experience",
    price: "$14",
    term: "1 month",
    description: "Perfect for testing live channels, VOD quality, and setup on your main screen.",
    features: [
      "24K+ live channel catalog",
      "Movies and series library",
      "HD and Full HD streams",
      "Single household connection",
      "Standard activation support",
    ],
    cta: "Start monthly",
  },
  {
    name: "Signature",
    eyebrow: "Most popular",
    price: "$69",
    term: "12 months",
    description: "The best value for year-round sports, premieres, global TV, and family viewing.",
    features: [
      "Everything in Starter",
      "4K and HDR priority sources",
      "Backup stream routes included",
      "Priority setup assistance",
      "Free player recommendations",
      "Seasonal channel refreshes",
    ],
    cta: "Choose Signature",
    highlighted: true,
  },
  {
    name: "Flex",
    eyebrow: "Balanced plan",
    price: "$39",
    term: "6 months",
    description:
      "A flexible plan for regular viewers who want premium stability without a long term.",
    features: [
      "24K+ live channel catalog",
      "Full VOD access",
      "HD, Full HD, and select 4K",
      "Anti-freeze routing",
      "Support by chat",
    ],
    cta: "Go Flex",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Pick your plan",
    description: "Choose the package that matches your household, device mix, and viewing habits.",
  },
  {
    number: "02",
    title: "Receive access",
    description: "Your secure login, setup guide, and recommended player are sent after checkout.",
  },
  {
    number: "03",
    title: "Start watching",
    description: "Sign in on your preferred device and stream live TV, sports, movies, and series.",
  },
] as const;

const testimonials = [
  {
    quote:
      "AstraView felt polished from the first setup message. My living room TV and tablet were both running in minutes.",
    name: "Maya R.",
    role: "Family viewer",
  },
  {
    quote:
      "The sports categories are easy to navigate, and backup sources saved the match when my old provider would usually buffer.",
    name: "Elias T.",
    role: "Weekend sports fan",
  },
  {
    quote:
      "The interface recommendations were clear, the picture quality is crisp, and support actually answered my device question.",
    name: "Nora K.",
    role: "Smart TV user",
  },
] as const;

const faqs = [
  {
    question: "Do I need special equipment?",
    answer:
      "No. AstraView works with popular IPTV players on Smart TVs, streaming boxes, phones, tablets, and computers.",
  },
  {
    question: "How quickly can I start?",
    answer:
      "Most customers can activate in a few minutes after receiving their login and device-specific setup steps.",
  },
  {
    question: "Is support included?",
    answer:
      "Yes. Every plan includes setup guidance, and the annual plan includes priority assistance for device changes.",
  },
  {
    question: "Can I watch movies and live sports?",
    answer:
      "Yes. Plans include live categories, sports coverage, and an on-demand entertainment catalog in one subscription.",
  },
] as const;

function LogoMark() {
  return (
    <Link href="#top" className="group flex items-center gap-3" aria-label={`${brand.name} home`}>
      <span className="relative grid size-11 place-items-center overflow-hidden rounded-2xl border border-cyan-300/25 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.24)]">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_28%),linear-gradient(135deg,rgba(34,211,238,0.22),rgba(124,58,237,0.38))]" />
        <RadioTower className="relative size-5 text-cyan-100" />
      </span>
      <span>
        <span className="block font-display text-lg font-semibold tracking-tight text-white">
          {brand.name}
        </span>
        <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-200/70">
          Premium IPTV
        </span>
      </span>
    </Link>
  );
}

function SectionHeading({
  kicker,
  title,
  description,
  centered = false,
}: {
  kicker: string;
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
      <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
        {kicker}
      </span>
      <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}

function PrimaryCta({
  href = "#pricing",
  children = "View plans",
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 text-sm font-bold text-slate-950 shadow-[0_18px_50px_rgba(34,211,238,0.24)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_70px_rgba(255,255,255,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
    >
      {children}
      <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
    </a>
  );
}

function SecondaryCta({
  href = "#contact",
  children = "Get setup help",
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
    >
      {children}
    </a>
  );
}

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid size-12 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <Icon className="size-5" />
    </span>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <LogoMark />
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            Contact
          </a>
          <PrimaryCta>Try AstraView</PrimaryCta>
        </div>
      </div>
    </header>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-xl lg:max-w-none">
      <div className="absolute -inset-8 rounded-[3rem] bg-cyan-400/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-[0_30px_120px_rgba(2,6,23,0.55)] backdrop-blur-xl">
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-rose-400" />
              <span className="size-2.5 rounded-full bg-amber-300" />
              <span className="size-2.5 rounded-full bg-emerald-300" />
            </div>
            <span className="text-xs font-medium text-slate-400">Live command center</span>
          </div>
          <div className="grid gap-3 p-3 sm:grid-cols-[1.2fr_0.8fr]">
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.38),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.35),transparent_32%),linear-gradient(135deg,#0f172a,#111827_45%,#020617)] p-5">
              <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  Live now
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <span className="size-1.5 rounded-full bg-emerald-300" />
                  Stable
                </span>
              </div>
              <div className="absolute left-5 right-5 top-24">
                <div className="grid aspect-video place-items-center rounded-3xl border border-white/15 bg-white/10 backdrop-blur">
                  <span className="grid size-16 place-items-center rounded-full bg-cyan-300 text-slate-950 shadow-[0_0_60px_rgba(34,211,238,0.45)]">
                    <Play className="ml-1 size-7 fill-current" />
                  </span>
                </div>
              </div>
              <div className="absolute inset-x-5 bottom-5">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Tonight</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-white">
                    Stadium finals in 4K
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-cyan-300" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              {heroChannels.map((channel, index) => (
                <div
                  key={channel}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-xs font-bold text-cyan-100">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{channel}</p>
                    <p className="text-xs text-slate-400">HD - FHD - 4K sources</p>
                  </div>
                  <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24"
    >
      <div className="absolute left-1/2 top-0 h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-0 top-28 hidden h-72 w-72 rounded-full bg-violet-500/20 blur-3xl lg:block" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
            <Sparkles className="size-4 text-cyan-200" />
            Premium streaming for every screen
          </span>
          <h1 className="mt-7 font-display text-5xl font-semibold tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl">
            Live TV, sports, movies, and series in one polished IPTV hub.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            AstraView gives modern households a smooth way to stream global channels, major sports,
            new releases, and on-demand favorites with guided setup and premium stability.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryCta>See plans</PrimaryCta>
            <SecondaryCta>Ask for compatibility</SecondaryCta>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
              >
                <p className="font-display text-2xl font-semibold text-white sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Why AstraView"
          title="Designed for viewers who expect a premium experience."
          description="Every detail is built around fast access, clear categories, reliable playback, and a setup flow that feels simple from the first click."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-white/[0.07]"
            >
              <IconBadge icon={feature.icon} />
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SportsSection() {
  return (
    <section id="sports" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
        <div>
          <SectionHeading
            kicker="Sports"
            title="Big-match energy with organized live categories."
            description="Follow headline events, regional channels, replays, and specialist sports networks from a streamlined guide made for quick switching."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {sports.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm font-semibold text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_25%_25%,rgba(34,211,238,0.32),transparent_32%),linear-gradient(135deg,#020617,#111827_60%,#172554)] p-5">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px]" />
          <div className="relative flex items-center justify-between">
            <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-950">
              Match center
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              4K available
            </span>
          </div>
          <div className="relative mt-20 grid place-items-center">
            <div className="relative grid size-48 place-items-center rounded-full border border-cyan-200/20 bg-cyan-300/10">
              <div className="absolute inset-6 rounded-full border border-white/10" />
              <RadioTower className="size-16 text-cyan-100" />
            </div>
          </div>
          <div className="relative mt-12 grid gap-3 sm:grid-cols-3">
            {["Live guide", "Backup links", "Event alerts"].map((label) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 backdrop-blur"
              >
                <Check className="size-5 text-cyan-200" />
                <p className="mt-3 text-sm font-semibold text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MoviesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.8fr]">
          <SectionHeading
            kicker="Movies and series"
            title="A cinematic library that looks premium on every screen."
            description="Explore hand-organized collections, binge-ready seasons, multilingual options, and fresh catalog updates without clutter."
          />
          <p className="text-sm leading-7 text-slate-400 lg:text-right">
            Original placeholders below show how artwork areas can scale without shipping heavy
            images on the first load.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {movieCards.map((movie) => (
            <article
              key={movie.title}
              className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.05]"
            >
              <div className={cn("relative aspect-[3/4] bg-gradient-to-br", movie.gradient)}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_22%),linear-gradient(180deg,transparent,rgba(2,6,23,0.86))]" />
                <div className="absolute left-4 top-4 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  Featured
                </div>
                <div className="absolute inset-x-4 bottom-4">
                  <p className="font-display text-2xl font-semibold text-white">{movie.title}</p>
                  <p className="mt-1 text-sm text-white/75">{movie.meta}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeviceCompatibilitySection() {
  return (
    <section id="devices" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          centered
          kicker="Compatibility"
          title="Your subscription follows you from sofa to suitcase."
          description="Use AstraView with popular IPTV players and modern devices. Setup instructions are tailored to the screen you want to use first."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <article
              key={device.label}
              className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-cyan-200/30 hover:bg-white/[0.07]"
            >
              <IconBadge icon={device.icon} />
              <div>
                <h3 className="font-display text-lg font-semibold text-white">{device.label}</h3>
                <p className="mt-1 text-sm text-slate-400">{device.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          centered
          kicker="Plans"
          title="Premium IPTV pricing without complicated contracts."
          description="Choose a plan, activate quickly, and enjoy a stable entertainment stack across your favorite screens."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-[2rem] border p-6",
                plan.highlighted
                  ? "border-cyan-200/40 bg-cyan-300 text-slate-950 shadow-[0_30px_100px_rgba(34,211,238,0.24)]"
                  : "border-white/10 bg-white/[0.045] text-white",
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-950">
                  Best value
                </span>
              )}
              <p
                className={cn(
                  "text-sm font-bold uppercase tracking-[0.18em]",
                  plan.highlighted ? "text-slate-700" : "text-cyan-200",
                )}
              >
                {plan.eyebrow}
              </p>
              <h3 className="mt-4 font-display text-2xl font-semibold">{plan.name}</h3>
              <div className="mt-5 flex items-end gap-2">
                <span className="font-display text-6xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                <span
                  className={cn(
                    "pb-2 text-sm font-semibold",
                    plan.highlighted ? "text-slate-700" : "text-slate-400",
                  )}
                >
                  / {plan.term}
                </span>
              </div>
              <p
                className={cn(
                  "mt-5 min-h-20 text-sm leading-7",
                  plan.highlighted ? "text-slate-800" : "text-slate-300",
                )}
              >
                {plan.description}
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm font-medium">
                    <Check
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        plan.highlighted ? "text-slate-950" : "text-cyan-200",
                      )}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={cn(
                  "mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-bold transition hover:-translate-y-0.5",
                  plan.highlighted
                    ? "bg-slate-950 text-white hover:bg-slate-800"
                    : "border border-white/15 bg-white/10 text-white hover:border-cyan-200/40 hover:bg-white/15",
                )}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 text-sm text-slate-300 md:grid-cols-3">
          {[
            { icon: LockKeyhole, label: "Secure checkout" },
            { icon: ShieldCheck, label: "Satisfaction-focused support" },
            { icon: CircleDollarSign, label: "No hidden activation fees" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="size-5 text-cyan-200" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          centered
          kicker="How it works"
          title="Start streaming in three simple steps."
          description="AstraView keeps activation clear, fast, and friendly even if this is your first IPTV subscription."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-7"
            >
              <span className="font-display text-5xl font-semibold text-cyan-200/30">
                {step.number}
              </span>
              <h3 className="mt-6 font-display text-2xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          centered
          kicker="Testimonials"
          title="Made for viewers who want fewer interruptions."
          description="Original customer stories that reflect the experience AstraView is built to deliver: simple setup, premium picture, and dependable support."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6"
            >
              <div className="flex gap-1 text-cyan-200" aria-label="Five star rating">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 text-base leading-8 text-slate-200">
                "{testimonial.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-cyan-300 text-sm font-bold text-slate-950">
                  {testimonial.name.slice(0, 1)}
                </span>
                <span>
                  <span className="block font-semibold text-white">{testimonial.name}</span>
                  <span className="block text-sm text-slate-400">{testimonial.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          kicker="FAQ"
          title="Questions before you switch?"
          description="Here are the details most viewers ask for before activating a new IPTV plan."
        />
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-white/10 bg-white/[0.045] p-5 open:border-cyan-200/30 open:bg-white/[0.07]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-white">
                {faq.question}
                <ChevronRight className="size-5 shrink-0 text-cyan-200 transition group-open:rotate-90" />
              </summary>
              <p className="mt-4 text-sm leading-7 text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCtaSection() {
  return (
    <section id="contact" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.28),transparent_28%),linear-gradient(135deg,rgba(14,165,233,0.18),rgba(124,58,237,0.18)_45%,rgba(15,23,42,0.95))] p-6 sm:p-10 lg:max-w-7xl lg:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
              Ready when you are
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Tell us your device and we will guide your setup.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
              Ask about compatibility, plan fit, or activation. A clean setup flow helps you get
              from checkout to streaming with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta href="mailto:hello@astraview.tv?subject=AstraView%20setup%20help">
                Email setup team
              </PrimaryCta>
              <SecondaryCta href="#pricing">Compare plans</SecondaryCta>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { icon: Clock3, label: "Fast activation guidance" },
              { icon: BadgeCheck, label: "Device-specific instructions" },
              { icon: Router, label: "Stability-focused stream routing" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-5 backdrop-blur"
              >
                <Icon className="size-6 text-cyan-200" />
                <span className="font-semibold text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <LogoMark />
        <p className="max-w-xl text-sm leading-7 text-slate-400">
          {brand.name} is an original premium IPTV concept brand. Content availability, channel
          lineup, and quality may vary by source, device, and region.
        </p>
        <div className="text-sm text-slate-500">
          <p>{brand.email}</p>
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function IptvHomepage() {
  return (
    <div className="min-h-screen scroll-smooth bg-slate-950 text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_36%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.16),transparent_32%),linear-gradient(180deg,#020617,#0f172a_38%,#020617)]" />
      <div className="relative z-10">
        <Header />
        <main id="main">
          <HeroSection />
          <FeaturesSection />
          <SportsSection />
          <MoviesSection />
          <DeviceCompatibilitySection />
          <PricingSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <FaqSection />
          <ContactCtaSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export const iptvFaqs = faqs;
export const iptvPlans = plans;
export const iptvBrand = brand;
