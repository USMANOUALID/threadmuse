/**
 * Shared env-var resolution. We read once at module load and throw early if
 * required keys are missing — better than failing inside a deep server call.
 */

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy .env.example to .env.local and fill it in.`,
    );
  }
  return v;
}

function optional(name: string): string | undefined {
  return process.env[name] || undefined;
}

export const supabaseEnv = {
  get url() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get anonKey() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  get serviceRoleKey() {
    return optional("SUPABASE_SERVICE_ROLE_KEY");
  },
};
