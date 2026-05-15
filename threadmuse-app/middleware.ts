import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Root middleware. Two jobs:
 *   1. Refresh Supabase's session cookie on every navigation so RSC calls
 *      see a logged-in user (Supabase rotates JWTs and the server can only
 *      see the latest cookie if we forward it through).
 *   2. Block unauthenticated access to /upload (extend the list as we add
 *      more authed surfaces in Phase 4/5).
 *
 * Everything else is excluded by `matcher` so static assets and the public
 * routes aren't slowed down by a token refresh roundtrip.
 */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match everything except:
     *  - api/* (webhooks, route handlers — manage their own auth)
     *  - _next/static  (static files)
     *  - _next/image   (image optimisation)
     *  - favicon, robots, sitemap, opengraph
     *  - anything with a file extension (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
