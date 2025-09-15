import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { isBypassRoutes, isProtectedRoutes, isPublicRoutes } from "./lib/permissions";

const BypassRoutes = createRouteMatcher(isBypassRoutes);
const PublicRoutes = createRouteMatcher(isPublicRoutes);
const ProtectedRoutes = createRouteMatcher(isProtectedRoutes);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
 if (BypassRoutes(request)) return
 const authed = await convexAuth.isAuthenticated()

 if (PublicRoutes(request) && authed) {
    return nextjsMiddlewareRedirect(request, `/dashboard`)
 }
 if (ProtectedRoutes(request) && !authed) {
    return nextjsMiddlewareRedirect(request, `/auth/sign-in`)
 }
  return
}, {
    cookieConfig: {maxAge: 60 * 60 * 24 * 30}
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
