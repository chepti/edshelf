import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            AI Tools for Teachers
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="hover:underline">
              All Tools
            </Link>
            <Link href="/add-tool" className="hover:underline">
              Add Tool
            </Link>
            {/* Add link to My Collections when implemented */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Sign In
              </Link>
            </SignedOut>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <footer className="bg-gray-200 text-center p-4">
        <p>&copy; {new Date().getFullYear()} AI Tools for Teachers Community</p>
      </footer>
    </div>
  );
} 