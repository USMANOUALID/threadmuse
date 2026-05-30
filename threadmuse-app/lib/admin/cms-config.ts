export type FieldType = "text" | "email" | "url" | "number" | "textarea" | "boolean" | "select" | "array" | "json" | "datetime";

export interface CmsField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  readonly?: boolean;
  options?: readonly string[];
  placeholder?: string;
  help?: string;
}

export interface CmsSectionConfig {
  key: string;
  label: string;
  description: string;
  table: string;
  primaryKey: string;
  orderBy?: string;
  orderAscending?: boolean;
  createLabel: string;
  createEnabled?: boolean;
  deleteEnabled?: boolean;
  fields: readonly CmsField[];
  listFields: readonly string[];
}

const cmsSectionsDefinition = {
  homepage: {
    key: "homepage",
    label: "Homepage builder",
    description: "Create, reorder, publish, and edit every homepage block rendered by the marketing site.",
    table: "homepage_sections",
    primaryKey: "id",
    orderBy: "display_order",
    orderAscending: true,
    createLabel: "Add homepage section",
    fields: [
      { name: "section_key", label: "Section key", type: "text", required: true, placeholder: "hero" },
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "body", label: "Body", type: "textarea" },
      { name: "cta_label", label: "CTA label", type: "text" },
      { name: "cta_href", label: "CTA URL", type: "text" },
      { name: "content", label: "Structured content JSON", type: "json", help: "Use JSON for arrays, stats, cards, logos, and nested module settings." },
      { name: "display_order", label: "Display order", type: "number" },
      { name: "is_published", label: "Published", type: "boolean" },
    ],
    listFields: ["section_key", "title", "is_published", "display_order", "updated_at"],
  },
  services: {
    key: "services",
    label: "Services builder",
    description: "Manage service offers, slugs, deliverables, publish status, and page ordering.",
    table: "services",
    primaryKey: "id",
    orderBy: "display_order",
    orderAscending: true,
    createLabel: "Add service",
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "deliverables", label: "Deliverables", type: "array", help: "One item per line." },
      { name: "icon", label: "Icon", type: "text" },
      { name: "display_order", label: "Display order", type: "number" },
      { name: "is_published", label: "Published", type: "boolean" },
    ],
    listFields: ["slug", "title", "is_published", "display_order", "updated_at"],
  },
  pricing: {
    key: "pricing",
    label: "Pricing builder",
    description: "Manage plans, pricing copy, CTA destinations, feature lists, and featured status.",
    table: "pricing_plans",
    primaryKey: "id",
    orderBy: "display_order",
    orderAscending: true,
    createLabel: "Add pricing plan",
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "name", label: "Plan name", type: "text", required: true },
      { name: "price", label: "Price", type: "text", required: true },
      { name: "cadence", label: "Cadence", type: "text", placeholder: "/mo" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "features", label: "Features", type: "array" },
      { name: "cta_label", label: "CTA label", type: "text", required: true },
      { name: "checkout_url", label: "Checkout URL", type: "url" },
      { name: "is_featured", label: "Featured", type: "boolean" },
      { name: "is_published", label: "Published", type: "boolean" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
    listFields: ["slug", "name", "price", "is_featured", "is_published"],
  },
  testimonials: {
    key: "testimonials",
    label: "Testimonials builder",
    description: "Manage customer proof, avatars, featured status, and testimonial ordering.",
    table: "testimonials",
    primaryKey: "id",
    orderBy: "display_order",
    orderAscending: true,
    createLabel: "Add testimonial",
    fields: [
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "company", label: "Company", type: "text" },
      { name: "avatar_url", label: "Avatar URL", type: "url" },
      { name: "is_featured", label: "Featured", type: "boolean" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
    listFields: ["name", "role", "company", "is_featured", "updated_at"],
  },
  faq: {
    key: "faq",
    label: "FAQ builder",
    description: "Manage questions, answers, categories, order, and published status.",
    table: "faq_items",
    primaryKey: "id",
    orderBy: "display_order",
    orderAscending: true,
    createLabel: "Add FAQ item",
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "display_order", label: "Display order", type: "number" },
      { name: "is_published", label: "Published", type: "boolean" },
    ],
    listFields: ["question", "category", "is_published", "display_order"],
  },
  blog: {
    key: "blog",
    label: "Blog editor",
    description: "Draft, edit, schedule, publish, and optimize blog articles.",
    table: "blog_posts",
    primaryKey: "id",
    orderBy: "updated_at",
    orderAscending: false,
    createLabel: "Create blog post",
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { name: "body", label: "Article body", type: "textarea" },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "cover_image_url", label: "Cover image URL", type: "url" },
      { name: "status", label: "Status", type: "select", options: ["draft", "scheduled", "published", "archived"] },
      { name: "published_at", label: "Published at", type: "datetime" },
      { name: "seo_title", label: "SEO title", type: "text" },
      { name: "seo_description", label: "SEO description", type: "textarea" },
    ],
    listFields: ["slug", "title", "category", "status", "updated_at"],
  },
  messages: {
    key: "messages",
    label: "Contact messages",
    description: "Review, qualify, reply to, archive, and assign website contact submissions.",
    table: "contact_messages",
    primaryKey: "id",
    orderBy: "created_at",
    orderAscending: false,
    createLabel: "Create message",
    createEnabled: false,
    fields: [
      { name: "name", label: "Name", type: "text", readonly: true },
      { name: "email", label: "Email", type: "email", readonly: true },
      { name: "company", label: "Company", type: "text", readonly: true },
      { name: "budget", label: "Budget", type: "text", readonly: true },
      { name: "message", label: "Message", type: "textarea", readonly: true },
      { name: "status", label: "Status", type: "select", options: ["new", "qualified", "replied", "archived"] },
      { name: "notes", label: "Internal notes", type: "textarea" },
    ],
    listFields: ["name", "email", "company", "status", "created_at"],
  },
  media: {
    key: "media",
    label: "Media library",
    description: "Upload, label, search, edit alt text, and remove CMS image assets.",
    table: "media_assets",
    primaryKey: "id",
    orderBy: "created_at",
    orderAscending: false,
    createLabel: "Register media asset",
    createEnabled: false,
    fields: [
      { name: "public_url", label: "Public URL", type: "url", readonly: true },
      { name: "storage_path", label: "Storage path", type: "text", readonly: true },
      { name: "alt_text", label: "Alt text", type: "text" },
      { name: "mime_type", label: "MIME type", type: "text", readonly: true },
      { name: "size_bytes", label: "Size bytes", type: "number", readonly: true },
    ],
    listFields: ["public_url", "alt_text", "storage_path", "created_at"],
  },
  settings: {
    key: "settings",
    label: "Website settings",
    description: "Manage global brand, support, tracking, social, and conversion settings as JSON documents.",
    table: "site_settings",
    primaryKey: "key",
    orderBy: "updated_at",
    orderAscending: false,
    createLabel: "Add setting",
    deleteEnabled: true,
    fields: [
      { name: "key", label: "Key", type: "text", required: true },
      { name: "value", label: "JSON value", type: "json", required: true },
    ],
    listFields: ["key", "updated_at"],
  },
  seo: {
    key: "seo",
    label: "SEO settings",
    description: "Manage per-route metadata, canonical URLs, Open Graph images, robots settings, and structured data.",
    table: "seo_settings",
    primaryKey: "path",
    orderBy: "path",
    orderAscending: true,
    createLabel: "Add SEO route",
    fields: [
      { name: "path", label: "Path", type: "text", required: true },
      { name: "title", label: "Meta title", type: "text", required: true },
      { name: "description", label: "Meta description", type: "textarea", required: true },
      { name: "canonical_url", label: "Canonical URL", type: "url" },
      { name: "og_image_url", label: "OG image URL", type: "url" },
      { name: "noindex", label: "Noindex", type: "boolean" },
      { name: "structured_data", label: "Structured data JSON", type: "json" },
    ],
    listFields: ["path", "title", "noindex", "updated_at"],
  },
  analytics: {
    key: "analytics",
    label: "Analytics dashboard",
    description: "Inspect event streams, conversion metadata, page paths, visitor IDs, and user attribution.",
    table: "analytics_events",
    primaryKey: "id",
    orderBy: "created_at",
    orderAscending: false,
    createLabel: "Log event",
    fields: [
      { name: "event_name", label: "Event name", type: "text", required: true },
      { name: "path", label: "Path", type: "text" },
      { name: "visitor_id", label: "Visitor ID", type: "text" },
      { name: "metadata", label: "Metadata JSON", type: "json" },
    ],
    listFields: ["event_name", "path", "visitor_id", "created_at"],
  },
  users: {
    key: "users",
    label: "User management",
    description: "Manage Supabase profile roles, admin status, verification, and account metadata.",
    table: "profiles",
    primaryKey: "id",
    orderBy: "created_at",
    orderAscending: false,
    createLabel: "Create profile",
    createEnabled: false,
    deleteEnabled: false,
    fields: [
      { name: "username", label: "Username", type: "text" },
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "select", options: ["member", "editor", "admin", "owner"] },
      { name: "is_admin", label: "Admin access", type: "boolean" },
      { name: "is_verified", label: "Verified", type: "boolean" },
      { name: "bio", label: "Bio", type: "textarea" },
    ],
    listFields: ["username", "name", "role", "is_admin", "created_at"],
  },
  newsletter: {
    key: "newsletter",
    label: "Newsletter management",
    description: "Manage subscribers, segments, sources, consent timestamps, and subscription status.",
    table: "newsletter_subscribers",
    primaryKey: "id",
    orderBy: "created_at",
    orderAscending: false,
    createLabel: "Add subscriber",
    fields: [
      { name: "email", label: "Email", type: "email", required: true },
      { name: "source", label: "Source", type: "text" },
      { name: "segment", label: "Segment", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["active", "unsubscribed", "bounced"] },
    ],
    listFields: ["email", "source", "segment", "status", "created_at"],
  },
} as const;

export type CmsSectionKey = keyof typeof cmsSectionsDefinition;
export const cmsSections: Record<CmsSectionKey, CmsSectionConfig> = cmsSectionsDefinition;
export type CmsRecord = Record<string, unknown>;

export function isCmsSectionKey(value: string): value is CmsSectionKey {
  return value in cmsSections;
}

export function getCmsSection(value: string) {
  return isCmsSectionKey(value) ? cmsSections[value] : null;
}
