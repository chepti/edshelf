import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
// import { dark } from '@clerk/themes'; // Optional: if you want a dark theme for Clerk components

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Tools for Teachers",
  description: "A community-driven repository of AI tools for educators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      // appearance={{ // Optional: Customizing Clerk components appearance
      //   baseTheme: dark, // Example: using dark theme
      //   variables: {
      //     colorPrimary: '#6366f1', // Example: indigo color for primary actions
      //   }
      // }}
    >
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
