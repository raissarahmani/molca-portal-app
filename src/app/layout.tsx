"use client"

import Script from 'next/script';
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

          {process.env.NODE_ENV === "production" && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `}
              </Script>
            </>
          )}
        </body>
      </html>
    </ClerkProvider>
  )
}