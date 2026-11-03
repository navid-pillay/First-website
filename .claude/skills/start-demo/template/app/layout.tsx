import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demo",
  description: "Demo site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">{children}</body>
    </html>
  );
}
