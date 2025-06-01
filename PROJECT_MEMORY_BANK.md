# Project Memory Bank: AI Tools for Teachers

This document tracks the progress, key decisions, and development steps for the "AI Tools for Teachers" project.

## Date: 2024-07-26 (Initial Setup & Scaffolding)

### User Request:
Create a full Next.js application for a community repository of AI tools for teachers. Features include:
1.  Display existing tools (name, description, link, tags, creator).
2.  Allow users to add new items (name, description, link, tags, creator name).
3.  Allow commenting on each tool (open text and star rating 1-5).
4.  Allow adding examples and tutorials for each tool (text, optional file, link).
5.  Allow creating personal collections of tools.
6.  Integrate Clerk for user authentication (registration, login, personal data).
7.  Separated internal API layer (`/pages/api/...` initially, planned for `/app/api/...` with App Router) for data access.
8.  Use Google Sheets as a temporary database for demo (via API).
9.  Deployable on Vercel with ENV variables.
10. Basic design (Tailwind/ShadCN) with responsiveness.
11. Code should be structured for easy migration from Google Sheets to Supabase later.

### Key Actions & Decisions:

1.  **Project Initialization:**
    *   Created a new Next.js project named `ai-tools-for-teachers` using `create-next-app`.
    *   Configuration: TypeScript, Tailwind CSS, ESLint, App Router, `src` directory, import alias `@/*`.
    *   Current working directory for terminal commands is `T:\CURSOR2\EdShelf\ai-tools-for-teachers`.

2.  **Dependency Installation:**
    *   Installed primary dependencies: `react`, `react-dom`, `next`.
    *   Installed additional dependencies:
        *   `@clerk/nextjs` (for user authentication)
        *   `googleapis` (for Google Sheets API interaction)
        *   `react-hook-form` (for form management)
        *   `zod` (for schema validation)
        *   `lucide-react` (for icons)
    *   Initialized `shadcn/ui` for UI components.
        *   Style: Default
        *   Base color: Slate
        *   Global CSS: `src/app/globals.css`
        *   CSS variables: Yes
        *   `tailwind.config.ts` location used.
        *   Import aliases: `@/components` for components, `@/lib/utils` for utils.
        *   React Server Components: Yes
        *   `components.json` created.
        *   `src/lib/utils.ts` created.

3.  **Shadcn/UI Component Installation:**
    *   Installed the following components: `button`, `input`, `card`, `badge`, `textarea`, `label`.

4.  **Directory and File Structure Scaffolding:**
    *   Created API route handlers (with mock data/logic):
        *   `src/app/api/tools/route.ts` (GET, POST)
        *   `src/app/api/reviews/route.ts` (GET, POST)
        *   `src/app/api/examples/route.ts` (GET, POST)
        *   `src/app/api/collections/route.ts` (GET, POST - with Clerk auth)
    *   Created page components:
        *   `src/app/(main)/layout.tsx` (Main layout with nav, Clerk UserButton)
        *   `src/app/(main)/page.tsx` (Homepage)
        *   `src/app/(main)/tools/page.tsx` (Display all tools, search)
        *   `src/app/(main)/tools/[id]/page.tsx` (Display single tool, reviews, examples)
        *   `src/app/(main)/add-tool/page.tsx` (Form to add new tool, using react-hook-form, zod, Clerk user)
    *   Created authentication pages (Clerk):
        *   `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
        *   `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
    *   Created core files:
        *   `src/middleware.ts` (Clerk middleware with protected routes)
        *   `src/types/index.ts` (Basic TypeScript interfaces: `AiTool`, `Review`, `Example`, `Collection`)
        *   `src/lib/google-sheets.ts` (Placeholder for Google Sheets API logic)
        *   `src/app/layout.tsx` (Root layout with `ClerkProvider`)
    *   Skipped creating `.env.local.example` due to `globalIgnore` restrictions, provided structure manually later.

5.  **Linter Error Resolution:**
    *   `src/middleware.ts`:
        *   Initially: `Module '"@clerk/nextjs"' has no exported member 'authMiddleware'`.
        *   Fix 1: Changed `authMiddleware` to `clerkMiddleware` from `@clerk/nextjs/server` and used `createRouteMatcher`.
        *   Initially: `Property 'userId' does not exist on type 'Promise<Auth>'` when calling `auth()` inside `clerkMiddleware` callback.
        *   Fix 2: Made callback `async` and used `await auth()`.
        *   Still error: `Property 'protect' does not exist on type 'ClerkMiddlewareAuthObject'` (after Fix 2).
        *   Fix 3 (Correct): Reverted callback to synchronous and called `auth().protect()` directly.
    *   `src/app/api/collections/route.ts`:
        *   Error: `Property 'userId' does not exist on type 'Promise<Auth>'`.
        *   Fix: Added `await` before `auth()` calls in GET and POST handlers.
    *   `src/app/(main)/tools/page.tsx`:
        *   Error: `Parameter 'e' implicitly has an 'any' type`.
        *   Fix: Added type `React.ChangeEvent<HTMLInputElement>` to the event parameter in `onChange`.
    *   `src/app/layout.tsx`:
        *   Error: `Cannot find module '@clerk/themes'`.
        *   Fix: Commented out the unused import of `dark` from `@clerk/themes`.

6.  **Environment Variables:**
    *   Provided a template structure for `.env.local` including keys for Clerk and Google Sheets.
    *   Emphasized not to commit `.env.local` to Git.

7.  **Git Version Control:**
    *   Configured Git global user email (`chepti@gmail.com`) and name (`chepti`).
    *   Added all project files to staging.
    *   Committed changes with message: "Initial project setup: Next.js, Clerk, Shadcn/UI, basic structure, and Linter fixes".
    *   Set remote URL for `origin` to `https://github.com/chepti/edshelf.git`.
    *   Renamed branch to `main`.
    *   Pushed the initial commit to the `main` branch on GitHub.

### Next Steps (Potential):
*   Implement Google Sheets API calls in `src/lib/google-sheets.ts`.
*   Connect API routes to use Google Sheets functions.
*   Implement forms for adding reviews and examples.
*   Develop UI for user collections.
*   Refine UI/UX and add more styling.
*   Write tests.

--- 