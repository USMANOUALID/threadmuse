import type { LucideIcon } from "lucide-react";
import { Bell, Compass, Heart, Home, MessageCircle, Plus, Search, TrendingUp, User } from "lucide-react";

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
  { key: "explore", label: "Explore", href: "/explore" },
  { key: "trending", label: "Trending", href: "/trending" },
  { key: "categories", label: "Categories", href: "/categories" },
];

/** Bottom tab bar (mobile). The middle item is rendered as a floating FAB. */
export const mobileNav: NavItem[] = [
  { key: "home",    label: "Home",    href: "/",        icon: Home },
  { key: "explore", label: "Explore", href: "/explore", icon: Search },
  { key: "upload",  label: "",        href: "/upload",  icon: Plus },
  { key: "saved",   label: "Saved",   href: "/saved",   icon: Heart },
  { key: "profile", label: "Profile", href: "/profile", icon: User },
];

/** Top-right utility actions on desktop. */
export const utilityNav: NavItem[] = [
  { key: "notifications", label: "Notifications", href: "/notifications", icon: Bell },
  { key: "messages", label: "Messages", href: "/messages", icon: MessageCircle },
];

export { TrendingUp, Compass };
