import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
// import { dark } from '@clerk/themes'; // Optional: if you want a dark theme for Clerk components

const assistant = Assistant({ 
  subsets: ["hebrew"],
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "אוסף כלי הבינה של חולמים תקשוב",
  description: "מאגר קהילתי של כלי בינה מלאכותית לאנשי חינוך והוראה.",
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
      <html lang="he" dir="rtl">
        <body className={assistant.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
