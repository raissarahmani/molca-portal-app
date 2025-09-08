import "@/styles/globals.css";

import { type Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "Portal - Molca",
  description: "Welcome to Portal",
  icons: [{ rel: "icon", url: "/logo2.png" }],
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
