import Link from "next/link";
import Image from "next/image";
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
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Image src="/logo.png" alt="לוגו אוסף כלי הבינה של חולמים תקשוב" width={32} height={32} />
            <span>אוסף כלי הבינה של חולמים תקשוב</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="hover:underline">
              כל הכלים
            </Link>
            <Link href="/add-tool" className="hover:underline">
              הוספת כלי
            </Link>
            {/* Add link to My Collections when implemented */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                כניסה
              </Link>
            </SignedOut>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <footer className="bg-gray-200 text-center p-4">
        <p>&copy; {new Date().getFullYear()} קהילת אוסף כלי הבינה של חולמים תקשוב</p>
      </footer>
    </div>
  );
} 