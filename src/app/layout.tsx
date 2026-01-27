import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/@components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "M-Motors",
  description: "The new apps for M-Motors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
