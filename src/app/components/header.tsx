"use client"

import Image from "next/image"
import { useState } from "react"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export default function Header() {
  const [active, setActive] = useState('')
  const options = ["Digital Twin", "VR", "AR", "Smart Manufacturing", "Deck", "Tools"]

  return (
    <div className="w-full py-1 px-5 flex flex-row justify-between items-center">
      <Image
        src="/logo.png"
        alt="Molca Logo"
        width={100}
        height={70}
        className="object-contain"
      />

      <SignedIn>
        <div className="flex gap-6">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setActive(option)}
              className={`${
                active === option
                  ? "text-[var(--color-primary)] font-semibold border-b-2 border-[var(--color-primary)]"
                  : "text-[var(--color-text)]"
              } text-sm hover:text-[var(--color-primary)] hover:font-semibold hover:cursor-pointer`}
            >
              {option}
            </button>
          ))}
        </div>
        
        <div>
          <UserButton />
        </div>
      </SignedIn>

      <SignedOut>

      </SignedOut>
    </div>
  )
}
