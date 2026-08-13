import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kevin Frazier | UGC Creator — Tech, Ocean, Animals",
  description: "San Diego-based UGC creator specializing in tech/gadgets, health/ocean sports, and pet content. Tested gear, honest takes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
