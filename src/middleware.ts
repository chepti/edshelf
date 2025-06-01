import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Example protected route
  '/add-tool(.*)', // Protect add tool page
  '/api/collections(.*)', // Protect collections API if it's user-specific and requires auth
  // Add other routes that require authentication
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.+\.[\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 