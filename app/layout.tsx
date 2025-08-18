import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google"; // Import Nunito Sans
import "./globals.css";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import Navbar from "@/components/shared/Navbar";
import AuthModal from "@/components/modals/AuthModal";
import { ReactNode } from "react";
import MobileSearchHeader from "@/components/search/MobileSearchHeader";
import MobileTabBar from "@/components/shared/MobileTabBar";
import MobileSearchModal from "@/components/modals/MobileSearchModal";

// Configure the font
const font = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Real Estate Platform",
  description: "Find your next property",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <NextAuthProvider>
          <AuthModal />
          <MobileSearchModal /> {/* Add the MobileSearchModal here */}
          <Navbar />
          <MobileSearchHeader />
          <MobileTabBar />
          <main className="pb-20 md:pb-0">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
