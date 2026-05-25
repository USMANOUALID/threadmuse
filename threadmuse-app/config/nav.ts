import type { LucideIcon } from "lucide-react";
import { BadgePercent, BookOpen, CirclePlay, Home, MessageCircle, PackageCheck, Rocket, Tv } from "lucide-react";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  external?: boolean;
}

/** Primary top-bar nav (desktop). */
export const desktopNav: NavItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "pricing", label: "Pricing", href: "/pricing" },
  { key: "trial", label: "Free trial", href: "/free-trial" },
  { key: "reseller", label: "Reseller", href: "/reseller" },
  { key: "tutorial", label: "Tutorial", href: "/tutorial" },
];

/** Bottom tab bar (mobile). The middle item is rendered as a floating FAB. */
export const mobileNav: NavItem[] = [
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "pricing", label: "Plans", href: "/pricing", icon: PackageCheck },
  { key: "trial", label: "", href: "/free-trial", icon: Rocket },
  { key: "reseller", label: "Reseller", href: "/reseller", icon: BadgePercent },
  { key: "tutorial", label: "Guide", href: "/tutorial", icon: BookOpen },
];

/** Top-right utility actions on desktop. */
export const utilityNav: NavItem[] = [
  { key: "whatsapp", label: "WhatsApp support", href: "https://wa.me/15551234567", icon: MessageCircle, external: true },
];

export { CirclePlay, Tv };
