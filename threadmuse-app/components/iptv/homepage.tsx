"use client";

import * as React from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Box,
  Check,
  ChevronRight,
  Clapperboard,
  CreditCard,
  Headphones,
  Laptop,
  LockKeyhole,
  MonitorPlay,
  Play,
  Projector,
  RadioTower,
  Route,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  TabletSmartphone,
  Trophy,
  Tv,
  Wifi,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  comparisonRows,
  counters,
  devices,
  faqs,
  features,
  footerLinks,
  heroChannels,
  iptvBrand,
  navItems,
  paymentMethods,
  plans,
  socialProof,
  steps,
  streamingIllustrations,
  testimonials,
  trustBadges,
  trustIndicators,
} from "@/components/iptv/data";

const iconMap = {
  box: Box,
  clapperboard: Clapperboard,
  headphones: Headphones,
  laptop: Laptop,
  mobile: Smartphone,
  projector: Projector,
  route: Route,
  tablet: TabletSmartphone,
  trophy: Trophy,
  tv: Tv,
} satisfies Record<string, LucideIcon>;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function MotionShell({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}

function SectionShell({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative px-4 py-20 [contain-intrinsic-size:1px_980px] [content-visibility:auto] sm:px-6 lg:px-8 lg:py-28",
        className,
      )}
    >
      {children}
    </section>
  );
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "border border-white/10 bg-white/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_28px_90px_rgba(2,6,23,0.36)] backdrop-blur-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-3xl", centered && "mx-auto text-center")}>
      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.13)]">
        <Sparkles className="size-3.5" />
        {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
    </Reveal>
  );
}

function LogoMark() {
  return (
    <Link
      href="#top"
      aria-label={`${iptvBrand.name} home`}
      className="group flex items-center gap-3"
    >
      <span className="relative grid size-12 place-items-center overflow-hidden rounded-2xl border border-cyan-200/25 bg-cyan-200/10 shadow-[0_0_45px_rgba(34,211,238,0.25)]">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.72),transparent_24%),linear-gradient(135deg,rgba(34,211,238,0.28),rgba(168,85,247,0.42)_52%,rgba(15,23,42,0.75))]" />
        <RadioTower className="relative size-5 text-white" />
      </span>
      <span>
        <span className="block font-display text-lg font-semibold tracking-tight text-white">
          {iptvBrand.name}
        </span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/70">
          {iptvBrand.tagline}
        </span>
      </span>
    </Link>
  );
}

function PrimaryCta({
  href = "#pricing",
  children = "View premium plans",
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full bg-cyan-200 px-6 text-sm font-black text-slate-950 shadow-[0_22px_70px_rgba(34,211,238,0.32)] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_28px_90px_rgba(255,255,255,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition duration-700 group-hover:translate-x-full" />
      <span className="relative inline-flex items-center gap-2">
        {children}
        <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

function SecondaryCta({
  href = "#contact",
  children = "Check device compatibility",
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-cyan-100/50 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
    >
      {children}
    </a>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <LogoMark />
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            Concierge help
          </a>
          <PrimaryCta href="#pricing">Start watching</PrimaryCta>
        </div>
      </div>
    </header>
  );
}

function DashboardMockup() {
  return (
    <m.div
      className="relative mx-auto max-w-2xl lg:max-w-none"
      initial={{ opacity: 0, scale: 0.96, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
    >
      <div className="absolute -inset-8 rounded-[3rem] bg-cyan-400/10 blur-3xl" />
      <GlassCard className="relative overflow-hidden rounded-[2.3rem] p-3">
        <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-slate-950">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-rose-400" />
              <span className="size-2.5 rounded-full bg-amber-300" />
              <span className="size-2.5 rounded-full bg-emerald-300" />
            </div>
            <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex">
              <Wifi className="size-4 text-emerald-300" />
              Route health: 99.9%
            </div>
          </div>
          <div className="grid min-h-[520px] gap-3 p-3 md:grid-cols-[180px_1fr]">
            <aside className="hidden rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:block">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">AstraOS</p>
              <div className="mt-7 space-y-2">
                {["Live TV", "Sports", "Movies", "Series", "Replay", "Kids"].map((item, index) => (
                  <div
                    key={item}
                    className={cn(
                      "rounded-2xl px-3 py-2 text-sm font-semibold",
                      index === 1 ? "bg-cyan-200 text-slate-950" : "text-slate-400",
                    )}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-cyan-200/20 bg-cyan-200/10 p-3">
                <p className="text-xs font-bold text-cyan-100">Active devices</p>
                <p className="mt-2 font-display text-3xl font-semibold text-white">06</p>
              </div>
            </aside>
            <div className="grid gap-3">
              <div className="relative min-h-[290px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.40),transparent_30%),radial-gradient(circle_at_82%_24%,rgba(168,85,247,0.42),transparent_34%),linear-gradient(135deg,#020617,#172554_55%,#111827)] p-5">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:52px_52px]" />
                <div className="relative flex items-center justify-between">
                  <span className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur">
                    Live championship
                  </span>
                  <span className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-100">
                    <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
                    UHD source
                  </span>
                </div>
                <div className="relative mt-14 grid place-items-center">
                  <m.div
                    className="grid size-20 place-items-center rounded-full bg-cyan-200 text-slate-950 shadow-[0_0_80px_rgba(34,211,238,0.48)]"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Play className="ml-1 size-8 fill-current" />
                  </m.div>
                </div>
                <div className="relative mt-14 grid gap-3 sm:grid-cols-3">
                  {["Frame sync", "Backup link", "Low latency"].map((label) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-slate-950/55 p-3 backdrop-blur"
                    >
                      <Check className="size-4 text-cyan-100" />
                      <p className="mt-2 text-xs font-bold text-white">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {heroChannels.map((channel) => (
                  <div
                    key={channel.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.05] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-display text-lg font-semibold text-white">
                          {channel.title}
                        </p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                          {channel.status}
                        </p>
                      </div>
                      <span className="grid size-10 place-items-center rounded-full bg-white/10 text-cyan-100">
                        <MonitorPlay className="size-5" />
                      </span>
                    </div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <m.div
                        className="h-full rounded-full bg-cyan-200"
                        initial={{ width: 0 }}
                        animate={{ width: channel.progress }}
                        transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </m.div>
  );
}

function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24"
    >
      <div className="absolute left-1/2 top-0 h-[760px] w-[1180px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-0 top-28 hidden h-80 w-80 rounded-full bg-violet-500/20 blur-3xl lg:block" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.88fr_1.12fr]">
        <m.div initial="hidden" animate="visible" variants={stagger}>
          <m.div
            variants={fadeUp}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-bold text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl"
          >
            <Sparkles className="size-4" />
            World-class IPTV for premium households
          </m.div>
          <m.h1
            variants={fadeUp}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 font-display text-5xl font-semibold tracking-[-0.075em] text-white sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            Luxury streaming, live channels, sports, and cinema in one command center.
          </m.h1>
          <m.p
            variants={fadeUp}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-2xl text-lg leading-9 text-slate-300"
          >
            AstraView blends a vast IPTV lineup with a premium dashboard feel, polished setup,
            4K-ready sources, and reliable multi-device viewing without the cable clutter.
          </m.p>
          <m.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PrimaryCta>Compare plans</PrimaryCta>
            <SecondaryCta>Explore experience</SecondaryCta>
          </m.div>
          <m.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-slate-200 backdrop-blur"
              >
                <ShieldCheck className="size-4 text-cyan-100" />
                {badge}
              </span>
            ))}
          </m.div>
        </m.div>
        <DashboardMockup />
      </div>
    </section>
  );
}

function CountersSection() {
  return (
    <section className="relative px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {counters.map((counter, index) => (
          <Reveal key={counter.label} delay={index * 0.04}>
            <GlassCard className="group rounded-[1.6rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-100/35 hover:bg-white/[0.075]">
              <p className="font-display text-4xl font-semibold tracking-[-0.04em] text-white">
                {counter.value}
              </p>
              <p className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-100">
                {counter.label}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{counter.detail}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <SectionShell id="experience">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Premium experience"
          title="Glass-smooth IPTV built to feel expensive."
          description="Every section is designed around clarity, speed, and a luxury streaming aesthetic: rich gradients, crisp contrast, clean hierarchy, and practical setup support."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <Reveal key={feature.title} delay={index * 0.05}>
                <GlassCard className="group h-full rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-cyan-100/35 hover:bg-white/[0.075]">
                  <span className="grid size-14 place-items-center rounded-2xl border border-cyan-100/20 bg-cyan-100/10 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.12)]">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-7 font-display text-xl font-semibold tracking-tight text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

function StreamingIllustrationsSection() {
  return (
    <SectionShell>
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.72fr]">
          <SectionHeading
            eyebrow="Streaming library"
            title="Premium artwork zones without slowing the page."
            description="Original CSS-generated posters and dashboard surfaces create a cinematic product feel while avoiding heavy image payloads."
          />
          <Reveal>
            <GlassCard className="rounded-[1.5rem] p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200">
                  <Zap className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">Fast Core Web Vitals strategy</p>
                  <p className="mt-1 text-sm text-slate-400">
                    No external artwork, lazy motion features, and render containment below the
                    fold.
                  </p>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {streamingIllustrations.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <m.article
                className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.055] shadow-[0_24px_80px_rgba(2,6,23,0.35)]"
                whileHover={{ y: -8, rotateX: 2, rotateY: index % 2 === 0 ? -2 : 2 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
              >
                <div className={cn("relative aspect-[3/4] bg-gradient-to-br", item.gradient)}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.55),transparent_24%),linear-gradient(180deg,transparent_35%,rgba(2,6,23,0.9))]" />
                  <div className="absolute left-4 top-4 rounded-full bg-black/25 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                    Astra Original
                  </div>
                  <div className="absolute inset-x-4 bottom-4">
                    <p className="font-display text-2xl font-semibold tracking-tight text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/75">{item.meta}</p>
                  </div>
                </div>
              </m.article>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function DevicesShowcase() {
  return (
    <SectionShell id="devices">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          centered
          eyebrow="Premium devices"
          title="A living-room centerpiece that travels with you."
          description="AstraView is designed for premium TVs, streaming boxes, phones, tablets, laptops, and home cinema setups with device-specific guidance."
        />
        <div className="mt-14 grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="relative min-h-[440px]">
              <div className="absolute left-4 right-4 top-10 rounded-[2rem] border border-white/10 bg-slate-900 p-3 shadow-[0_35px_110px_rgba(2,6,23,0.55)]">
                <div className="aspect-video rounded-[1.4rem] bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.36),transparent_28%),radial-gradient(circle_at_80%_25%,rgba(168,85,247,0.36),transparent_30%),linear-gradient(135deg,#020617,#172554,#111827)] p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cyan-200 px-3 py-1 text-xs font-black text-slate-950">
                      Smart TV
                    </span>
                    <Tv className="size-6 text-white" />
                  </div>
                  <div className="mt-20 max-w-xs">
                    <p className="font-display text-3xl font-semibold text-white">
                      Cinema dashboard
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      Live, VOD, series, and replay in one guide.
                    </p>
                  </div>
                </div>
              </div>
              <GlassCard className="absolute bottom-0 left-0 w-44 rounded-[2rem] p-3">
                <div className="aspect-[9/16] rounded-[1.4rem] bg-[linear-gradient(160deg,#0f172a,#0e7490,#312e81)] p-3">
                  <Smartphone className="size-5 text-cyan-100" />
                  <p className="mt-20 font-display text-xl font-semibold text-white">Mobile live</p>
                </div>
              </GlassCard>
              <GlassCard className="absolute bottom-8 right-0 hidden w-56 rounded-[2rem] p-3 sm:block">
                <div className="aspect-[4/3] rounded-[1.4rem] bg-[linear-gradient(140deg,#111827,#6d28d9,#0891b2)] p-4">
                  <TabletSmartphone className="size-6 text-white" />
                  <p className="mt-16 font-display text-2xl font-semibold text-white">Tablet VOD</p>
                </div>
              </GlassCard>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {devices.map((device, index) => {
              const Icon = iconMap[device.icon];
              return (
                <Reveal key={device.label} delay={index * 0.04}>
                  <GlassCard className="flex h-full items-center gap-4 rounded-[1.5rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-100/35 hover:bg-white/[0.075]">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-cyan-100/10 text-cyan-100">
                      <Icon className="size-6" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">
                        {device.label}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">{device.detail}</p>
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function ComparisonSection() {
  return (
    <SectionShell id="compare">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          centered
          eyebrow="Comparison"
          title="Why choose us vs traditional cable."
          description="AstraView is designed around modern streaming habits: more content, faster setup, better device freedom, and a cleaner premium experience."
        />
        <Reveal className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] backdrop-blur-2xl">
          <div className="grid grid-cols-[0.9fr_1fr_1fr] border-b border-white/10 bg-white/[0.05] px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            <span>Feature</span>
            <span className="text-cyan-100">AstraView</span>
            <span>Traditional cable</span>
          </div>
          {comparisonRows.map((row) => (
            <div
              key={row.feature}
              className="grid gap-4 border-b border-white/10 px-5 py-5 last:border-b-0 md:grid-cols-[0.9fr_1fr_1fr]"
            >
              <div className="font-display text-lg font-semibold text-white">{row.feature}</div>
              <div className="flex gap-3 text-sm leading-7 text-slate-200">
                <Check className="mt-1 size-4 shrink-0 text-cyan-100" />
                <span>{row.astraView}</span>
              </div>
              <div className="flex gap-3 text-sm leading-7 text-slate-400">
                <X className="mt-1 size-4 shrink-0 text-rose-300" />
                <span>{row.cable}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </SectionShell>
  );
}

function PricingSection() {
  return (
    <SectionShell id="pricing">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          centered
          eyebrow="Pricing"
          title="Premium IPTV plans with luxury presentation."
          description="Choose a flexible plan and start streaming live TV, sports, movies, and series with guided activation and premium route support."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.06}>
              <m.article
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-6 transition duration-300",
                  plan.popular
                    ? "border-cyan-100/45 bg-cyan-200 text-slate-950 shadow-[0_35px_120px_rgba(34,211,238,0.28)]"
                    : "border-white/10 bg-white/[0.055] text-white shadow-[0_24px_90px_rgba(2,6,23,0.32)] backdrop-blur-2xl",
                )}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 210, damping: 20 }}
              >
                {plan.popular && (
                  <div className="absolute right-5 top-5 rounded-full bg-slate-950 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white">
                    Popular
                  </div>
                )}
                <p
                  className={cn(
                    "text-sm font-black uppercase tracking-[0.2em]",
                    plan.popular ? "text-slate-700" : "text-cyan-100",
                  )}
                >
                  {plan.eyebrow}
                </p>
                <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight">
                  {plan.name}
                </h3>
                <div className="mt-6 flex items-end gap-2">
                  <span className="font-display text-7xl font-semibold tracking-[-0.06em]">
                    {plan.price}
                  </span>
                  <span
                    className={cn(
                      "pb-3 text-sm font-bold",
                      plan.popular ? "text-slate-700" : "text-slate-400",
                    )}
                  >
                    / {plan.term}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-6 min-h-20 text-sm leading-7",
                    plan.popular ? "text-slate-800" : "text-slate-300",
                  )}
                >
                  {plan.description}
                </p>
                <ul className="mt-7 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm font-semibold">
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          plan.popular ? "text-slate-950" : "text-cyan-100",
                        )}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={cn(
                    "mt-9 inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-black transition duration-300 hover:-translate-y-0.5",
                    plan.popular
                      ? "bg-slate-950 text-white hover:bg-slate-800"
                      : "border border-white/15 bg-white/10 text-white hover:border-cyan-100/45 hover:bg-white/15",
                  )}
                >
                  {plan.cta}
                </a>
              </m.article>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function HowItWorksSection() {
  return (
    <SectionShell>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          centered
          eyebrow="Activation"
          title="From checkout to streaming in three calm steps."
          description="The premium experience continues after purchase with simple instructions, secure delivery, and practical device guidance."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.05}>
              <GlassCard className="relative h-full overflow-hidden rounded-[1.8rem] p-7">
                <span className="font-display text-6xl font-semibold text-cyan-100/25">
                  {step.number}
                </span>
                <h3 className="mt-7 font-display text-2xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{step.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = testimonials[activeIndex] ?? testimonials[0];

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <SectionShell>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          centered
          eyebrow="Social proof"
          title="A premium IPTV experience viewers actually feel."
          description="Realistic customer stories and trust metrics reinforce the high-end experience: simple setup, crisp streams, and responsive support."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="grid gap-4">
            {socialProof.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.04}>
                <GlassCard className="rounded-[1.5rem] p-5">
                  <p className="font-display text-4xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-100">
                    {item.label}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
          <GlassCard className="overflow-hidden rounded-[2rem] p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <m.figure
                key={active.name}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
              >
                <div className="flex gap-1 text-cyan-100" aria-label="Five star rating">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-8 font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                  "{active.quote}"
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="grid size-14 place-items-center rounded-2xl bg-cyan-200 text-lg font-black text-slate-950">
                    {active.name.slice(0, 1)}
                  </span>
                  <span>
                    <span className="block font-semibold text-white">{active.name}</span>
                    <span className="block text-sm text-slate-400">{active.role}</span>
                  </span>
                </figcaption>
              </m.figure>
            </AnimatePresence>
            <div className="mt-8 flex gap-2">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-2.5 rounded-full transition-all",
                    index === activeIndex
                      ? "w-10 bg-cyan-200"
                      : "w-2.5 bg-white/20 hover:bg-white/35",
                  )}
                  aria-label={`Show testimonial from ${testimonial.name}`}
                />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </SectionShell>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState(0);

  return (
    <SectionShell id="faq">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
        <SectionHeading
          eyebrow="FAQ"
          title="Premium answers before you switch."
          description="AstraView keeps the buying journey clear with practical information about devices, activation, content, support, and cable replacement."
        />
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = index === openIndex;
            return (
              <GlassCard key={faq.question} className="overflow-hidden rounded-[1.5rem]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg font-semibold text-white">
                    {faq.question}
                  </span>
                  <m.span
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-cyan-100/10 text-cyan-100"
                  >
                    <ChevronRight className="size-5" />
                  </m.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                    >
                      <p className="px-5 pb-5 text-sm leading-7 text-slate-300">{faq.answer}</p>
                    </m.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

function ContactCtaSection() {
  return (
    <SectionShell id="contact">
      <div className="mx-auto max-w-7xl">
        <GlassCard className="relative overflow-hidden rounded-[2.4rem] p-7 sm:p-10 lg:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.24),transparent_34%)]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.78fr]">
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-cyan-100">
                Concierge setup
              </span>
              <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                Tell us your device. We will guide the luxury setup.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                Ask about device compatibility, plan fit, activation, or switching from cable. The
                fastest way to a premium IPTV experience is a clean first setup.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryCta href={`mailto:${iptvBrand.email}?subject=AstraView%20setup%20help`}>
                  Email concierge
                </PrimaryCta>
                <SecondaryCta href="#pricing">Return to pricing</SecondaryCta>
              </div>
            </div>
            <div className="grid gap-4">
              {[
                { icon: LockKeyhole, label: "Secure account delivery" },
                { icon: BadgeCheck, label: "Device-specific instructions" },
                { icon: CreditCard, label: "Flexible payment options" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/45 p-5 backdrop-blur"
                >
                  <Icon className="size-6 text-cyan-100" />
                  <span className="font-semibold text-white">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </SectionShell>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <LogoMark />
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              {iptvBrand.name} is an original premium IPTV concept brand designed for luxury
              streaming, device freedom, and polished activation.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {trustIndicators.map((indicator) => (
                <span
                  key={indicator}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-slate-300"
                >
                  {indicator}
                </span>
              ))}
            </div>
          </div>
          {footerLinks.map((column) => (
            <div key={column.heading}>
              <h3 className="text-xs font-black uppercase tracking-[0.22em] text-white">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-cyan-100"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-5 border-t border-white/10 pt-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Payment methods
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black text-slate-200"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
          <div className="text-sm text-slate-500 md:text-right">
            <p>{iptvBrand.email}</p>
            <p>
              © {new Date().getFullYear()} {iptvBrand.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function IptvHomepage() {
  return (
    <MotionShell>
      <div className="min-h-screen scroll-smooth bg-slate-950 text-slate-100 selection:bg-cyan-200 selection:text-slate-950">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_30%),linear-gradient(180deg,#020617,#0f172a_36%,#020617_76%)]" />
        <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="relative z-10">
          <Header />
          <main id="main">
            <HeroSection />
            <CountersSection />
            <ExperienceSection />
            <StreamingIllustrationsSection />
            <DevicesShowcase />
            <ComparisonSection />
            <PricingSection />
            <HowItWorksSection />
            <TestimonialsCarousel />
            <FaqSection />
            <ContactCtaSection />
          </main>
          <Footer />
        </div>
      </div>
    </MotionShell>
  );
}
