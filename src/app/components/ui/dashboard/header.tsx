"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { SignedIn, UserButton } from "@clerk/nextjs"

export default function Header() {
  const [active, setActive] = useState('Dashboard')
  const options = ["Home", "Dashboard", "Analytics"]

  return (
    <div className="w-full py-1 px-5 flex flex-row justify-between items-center relative">
      <Image
        src="/logo3.png"
        alt="Molca Logo"
        width={100}
        height={70}
        className="object-contain"
      />

      <SignedIn>
        <div className="flex gap-6">
          {options.map(option => (
            <Link
              href={`/${option.toLowerCase()}`}
              key={option}
              onClick={() => setActive(option)}
              className={`${
                active === option
                  ? "font-semibold"
                  : "font-normal"
              } text-[var(--color-base)] text-sm hover:text-[var(--color-base)] hover:scale-105 hover:duration-200 hover:cursor-pointer`}
            >
              {option}
            </Link>
            ))}
        </div>
        <div className="px-3"><UserButton /></div>  
      </SignedIn>
    </div>
  )
}
