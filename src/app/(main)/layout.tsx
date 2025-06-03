import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from "next/link";
import Image from "next/image";
import { Toaster } from 'react-hot-toast';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div dir="rtl" lang="he" className="min-h-screen flex flex-col font-rubik">
        <Toaster position="top-center" reverseOrder={false} />
        <header className="bg-brand-primary text-white p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="לוגו חולמים תקשוב" width={40} height={40} className="rounded-full" />
              <span className="text-xl font-semibold">אוסף כלי הבינה של חולמים תקשוב</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/tools" className="hover:text-brand-accent transition-colors">כל הכלים</Link>
              <Link href="/add-tool" className="hover:text-brand-accent transition-colors">הוספת כלי</Link>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </nav>
        </header>
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <footer className="bg-gray-100 dark:bg-gray-800 text-center p-4 text-sm text-gray-600 dark:text-gray-400">
          נבנה באהבה עבור קהילת חולמים תקשוב {new Date().getFullYear()} ©
        </footer>
      </div>
    </ClerkProvider>
  );
} 