"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { SignedIn, UserButton } from "@clerk/nextjs"

export default function Header() {
  const [active, setActive] = useState('')
  const options = ["Digital Twin", "VR", "AR", "Smart Manufacturing", "Deck", "Tools"]

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
        <div className="px-3"><UserButton /></div>  
      </SignedIn>
    </div>
  )
}
