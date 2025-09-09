"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth, SignedOut, SignedIn } from "@clerk/nextjs";
import Header from "./components/header";
import Home from "./home/page";

export default function HomePage() {
  const {isSignedIn} = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    if (isSignedIn) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  return (
    <main
     style={{
         backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/bg.png')`, 
         backgroundSize: 'cover', 
         backgroundRepeat: 'no-repeat',
         backgroundPosition: 'center'
     }}
     className="relative min-h-screen"
    >
      <SignedOut>
        <div><Header /></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center px-30">
          <Image
            src="/logo2.png"
            alt="Molca Logo"
            width={70}
            height={70}
            className="object-contain"
          />
          <p className="text-5xl/15 text-center font-semibold title py-5 px-60">Operating System for Industrial Infrastructure</p>
          <p className="text-sm text-center px-100">Powered by Digital Twin, AR/VR, & Smart Manufacturing Solutions</p>
          <button type="button" onClick={handleLogin} className="button bg-[var(--color-primary)] text-[var(--color-base)] w-1/2">Login</button>
        </div>
      </SignedOut>

      <SignedIn>
        <Home />
      </SignedIn>
    </main>
  );
}
