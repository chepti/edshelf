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
      <header className="bg-slate-100 text-slate-800 p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold text-slate-700 hover:text-brand-primary transition-colors">
            <div className="bg-white p-1 rounded-full shadow-sm">
              <Image src="/logo.png" alt="לוגו אוסף כלי הבינה של חולמים תקשוב" width={36} height={36} />
            </div>
            <span>אוסף כלי הבינה של חולמים תקשוב</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-slate-600 hover:text-brand-primary transition-colors">
              כל הכלים
            </Link>
            <Link href="/add-tool" className="text-slate-600 hover:text-brand-primary transition-colors">
              הוספת כלי
            </Link>
            {/* Add link to My Collections when implemented */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link 
                href="/sign-in" 
                className="bg-brand-primary hover:bg-opacity-90 text-white font-bold py-2 px-5 rounded-5xl transition-colors duration-150 shadow hover:shadow-md"
              >
                כניסה
              </Link>
            </SignedOut>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <footer className="bg-slate-200 text-slate-600 text-center p-4">
        <p>&copy; {new Date().getFullYear()} קהילת אוסף כלי הבינה של חולמים תקשוב</p>
      </footer>
    </div>
  );
} 