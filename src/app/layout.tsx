import type { Metadata } from "next";

import Footer from "@/@components/Footer/Footer";
import Navbar from "@/@components/Navbar/Navbar";
import "./globals.css";

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
        <Footer />
      </body>
    </html>
  );
}
