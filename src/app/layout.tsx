import type { Metadata } from "next";

import Footer from "@/@features/Homepage/Footer/Footer";
import Navbar from "@/@features/Homepage/Navbar/Navbar";
import { Providers } from "./providers";
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
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
