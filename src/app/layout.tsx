import { type Metadata } from 'next'
import { Poppins, Roboto } from "next/font/google";
import {
  ClerkProvider
} from '@clerk/nextjs'
import "@/styles/globals.css";


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
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.variable} ${roboto.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}