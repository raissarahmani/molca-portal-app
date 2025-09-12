import Image from "next/image"
import Link from "next/link"
import { SignedIn, UserButton, useUser } from "@clerk/nextjs"

type HeaderProps = {
  active: string;
  onChange: (value: string) => void;
};

export default function Header({ active, onChange }: HeaderProps) {
  const {user, isLoaded} = useUser()
  if (!isLoaded) return null;
  const role = user?.publicMetadata.role
  console.log(role)

  const options = ["Digital Twin", "VR", "AR", "Smart Manufacture", "Deck", "Tools"]
  const filteredOptions = options.filter(option => {
    if (role === "sales") {
      return ["Deck", "Tools"].includes(option)
    }
    return true
  })

  return (
    <div className="w-full py-1 px-5 flex flex-row justify-between items-center relative">
      <Image
        src="/logo.png"
        alt="Molca Logo"
        width={100}
        height={70}
        className="object-contain"
      />

      <SignedIn>
        <div className="flex gap-6">
          {filteredOptions.map(option => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`${
                active === option
                  ? "text-[var(--color-primary)] font-semibold border-b-2 border-[var(--color-primary)]"
                  : "text-[var(--color-text)]"
              } text-sm hover:text-[var(--color-primary)] hover:scale-105 hover:duration-200 hover:cursor-pointer`}
            >
              {option}
            </button>
            ))}
        </div>
        
        <div className="flex flex-row gap-3 items-center px-3">
          <Link href="/dashboard" className="flex flex-row gap-2 button m-0 border bg-[var(--color-primary)] text-[var(--color-base))]">
            <Image
              src="/go.svg"
              alt="Go to dashboard"
              width={20}
              height={20}
              className="object-contain"
            />
            <p className="font-semibold">Dashboard</p>
          </Link>
          <UserButton />
        </div>
      </SignedIn>
    </div>
  )
}
